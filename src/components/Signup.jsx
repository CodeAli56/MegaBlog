import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'


function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const {register, handleSubmit} = useForm()

    const handleSignUp  = async (data) => {
        setError("")
        try {
           const userData = await authService.createAccount(data);
           if(userData){
            const user = await authService.getCurrentUsers()
            user && dispatch(login(user))
            navigate("/")
           }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>

                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%'/>
                    </span>
                </div>  
        
                <h1 className='mt-2 text-2xl mb-2 font-bold text-center'>Don&apos;t have any account?&nbsp; </h1>

                <form onSubmit={handleSubmit(handleSignUp)}>
                    
                    <div className='space-y-5'>

                        <Input label="Full name" placeholder="Enter your full name" type="text" 
                        {...register("name", { required:true })} />
                        
                        <Input label="Email" placeholder="Enter your email" type="email" 
                        {...register("email", {
                            required: true,
                            validate:{
                                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                            }
                        })} />
                        
                        <Input label="Password" placeholder="Enter your Password" type="password" 
                        {...register("password", { required:true })} />

                        <Button type='submit' className='w-full'> Sign Up </Button>    
                        
                    </div>

                </form>

                <h2 className='text-center text-xl font-bold leading-tight my-2'>Already have an account?</h2>
                
                <Link to={`/login`} className='font-medium text-primary transition-all duration-200 hover:underline'>
                    Sign In
                </Link>

                {error && <p className='text-red-500 text-center mt-8'>{error}</p>}

            </div>
        </div>
    )
}

export default Signup