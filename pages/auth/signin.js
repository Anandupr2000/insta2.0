import React from 'react'
import { getProviders, signIn as SignInToProvider } from "next-auth/react"
import { useRouter } from 'next/router'
function SignIn({ providers }) {
    const logo = "https://links.papareact.com/ocw"
    const router = useRouter()
    console.log("inside SignIn")
    return (
        <div className='grid grid-cols-1 lg: md:grid-cols-2 mx-auto'>
            <div className='hidden md:inline-block min-w-max mt-10 mb-16'>
                <img src="insta.png" className="mx-auto h-86" alt="" />
            </div>
            <div className="mx-auto">
                <div className='flex flex-1 flex-col w-96 my-32 space-y-5 items-center justify-center border ml-12 mr-12 p-3 border-gray-300 rounded-lg mx-auto'>
                    <img className="w-64 cursor-pointer" onClick={() => router.push('/')} src={logo} alt="" />
                    <form action="" className='customForm'>
                        <input className="userInp" type="email" name="" placeholder="Email address" id="" />
                        <input className="userInp" type="password" name="" placeholder="Password" id="" />
                        <input className='button self-start' type="submit" value="SignIn" />
                    </form>
                    <p className='self-start pl-5'>or Sign in with :</p>
                    <div className='flex space-x-5'>
                        {
                            console.log(providers)
                        }
                        {
                            providers && Object.values(providers).map((provider) => (
                                <div key={provider.name}>
                                    <button
                                        onClick={() => SignInToProvider(provider.id, { callbackUrl: "/" })}>
                                        Login With {provider.name}
                                    </button>
                                </div>
                            ))}
                        {/* {Object.values(providers).map((provider) => {
                            console.log(provider)
                            return <div className="button" key={provider.name}>
                                <button onClick={() => SignInToProvider(provider.id, { callbackUrl: "/" })}>
                                    {provider.name}
                                </button>
                            </div>
                        })} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

// getServerSideProps() is serverside fn
export async function getServerSideProps() {
    const providers = await getProviders()
    return {
        props: { providers, }
    }
}

export default SignIn