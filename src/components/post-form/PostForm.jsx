import React, {useCallback, useEffect} from 'react'
import { useForm } from 'react-hook-form'
import {Button, Input, Select, RTE} from "../index"
import service from '../../appwrite/postConfig'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'



function PostForm({post}) {
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues:{
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active"
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.userData)
    
    const submit = async(data) => {
        if (post){
            const file = data.image[0] ? await service.uploadFile(data.image[0]) : null
            if (file){
                service.deleteFile(post.featuredImage)
            }
            const dbPost = await service.updatePost(post.$id, {...data, featuredImage: file ? file.$id : undefined})
            if (dbPost){
                navigate("/all-posts")
            }
        }else{
            
            const file = await service.uploadFile(data.image[0])
            if (file){
                data.featuredImage = file.$id;
                const dbPost = await service.createPost({...data, userId: userData.$id, });
                if (dbPost){
                    navigate(`/all-posts`)
                }
            }
        }
    }       

    const slugTransform = useCallback((value)=>{
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    },[])


    useEffect(()=>{
        const subscription = watch((value, {name})=>{
            if(name === "title"){
                setValue("slug", slugTransform(value.title, {shouldValidate: true}))
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    },[watch, slugTransform, setValue])


    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    classes="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    classes="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    classes="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    classes="my-6"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full mt-6">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm