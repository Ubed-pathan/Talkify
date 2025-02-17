import axios, { AxiosResponse } from 'axios';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import { userState } from '../state_manage/UserState';

interface SignInDataType {
    username: string,
    password: string
}

function SignIn({ pageChangeToSignUp }: { pageChangeToSignUp: () => void }) {
    const setUserState = useSetRecoilState(userState);

    const [signInData, setSignInData] = useState<SignInDataType>({
        username: '',
        password: ''
    })


    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setSignInData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    }

    async function handleSignIn(e: FormEvent): Promise<void> {
        e.preventDefault();
        const response: AxiosResponse = await axios.post(`${import.meta.env.VITE_SERVER_API}/user/signin`,
            signInData,
            {
                withCredentials: true
            });

        if (response.status === 201) {
            toast.success("😄 signed in successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });

            setTimeout(() => {
                setUserState({
                    isLoggedIn: true,
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    about: response.data.about,
                    profileImage: null,
                })

                setSignInData({
                    username: '',
                    password: ''
                });

            }, 1100);
        } else if (response.status === 200) {
            toast.error(`😡 ${response.data}`, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });

            setSignInData({
                username: '',
                password: ''
            });
        } else if (response.status === 202) {
            toast.error(`😡 ${response.data}`, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });

            setSignInData({
                username: '',
                password: ''
            });
        }
    }
    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center min-h-screen bg-bg-100">
                    <div className=" w-[90%] md:w-full max-w-md p-8 bg-bg-300 shadow-xl rounded-lg">
                        <h2 className="text-3xl text-center text-text-200 mb-6">SignIn</h2>

                        <form className="space-y-8" onSubmit={handleSignIn}>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder=" "
                                    required
                                    name='username'
                                    value={signInData.username}
                                    onChange={handleChange}
                                    onInput={(e) => e.currentTarget.value = e.currentTarget.value.trimStart()}
                                    pattern=".*\S.*"
                                    title="Username cannot be empty or whitespace"
                                    className="peer w-full border-b-2 border-gray-300 bg-bg-300 text-text-200  focus:outline-none focus:border-custom-blue placeholder-transparent"
                                />
                                <label
                                    className="absolute left-0 text-accent-100 top-[-16px] text-xs transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent-100 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-custom-blue"
                                >
                                    Username*
                                </label>
                            </div>


                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder=" "
                                    name='password'
                                    value={signInData.password}
                                    onChange={handleChange}
                                    required
                                    onInput={(e) => e.currentTarget.value = e.currentTarget.value.trimStart()}
                                    pattern=".*\S.*"
                                    title="Password cannot be empty or whitespace"
                                    className="peer w-full border-b-2 bg-bg-300 border-gray-300 text-text-200 focus:outline-none focus:border-custom-blue placeholder-transparent"
                                />
                                <label
                                    className="absolute left-0 text-accent-100 top-[-16px] text-xs transition-all duration-200 peer-placeholder-shown:top-0 peer-placeholder-shown:text-sm peer-placeholder-shown:text-accent-100 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-custom-blue"
                                >
                                    Password*
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-accent-100 text-bg-100 py-2 px-4 rounded-lg hover:bg-custom-blue transition-colors"
                            >
                                SignIn
                            </button>
                        </form>
                        <h1 className='mt-10 text-center text-text-200'>
                            Already have an account: <a className='cursor-pointer text-accent-100 underline' onClick={() => pageChangeToSignUp()}>
                                SignUp
                            </a>
                        </h1>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                />
            </div>
        </>
    )
}

export default SignIn