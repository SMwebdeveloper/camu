import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSchema } from "../lib/validation";
import { useMutation } from "@tanstack/react-query";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../../public/logo.jpg";
import $axios from "../http";
import { useState } from "react";
import useLanguageStore from "../store/useLanguage";
import useAuthStore from "../store/useAuth";
import {useNavigate} from 'react-router-dom'
import ButtonLoader from "../components/ButtonLoader";
// import LanguageSelect from "../components/LanguageSelect";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AuthSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values) => {
       const params = new URLSearchParams();
       params.append("username", values.username);
       params.append("password", values.password);
       

       const user = await $axios.post("/auth/token", params, {
         headers: {
           "Content-Type": "application/x-www-form-urlencoded",
         },
       });
      return user;
    },
    onSuccess: (data) => {
      setUser(data);
      sessionStorage.setItem("accessToken", data.data.access_token)
      navigate('/')
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col gap-16 w-full items-center justify-center h-full pt-4">
      {/* <div className="w-full flex justify-end">
        <LanguageSelect />
      </div> */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl ">
        {/* Chap blok */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10 text-center text-white bg-gradient-to-br from-slate-800 to-slate-900">
          <img
            src={Logo}
            alt="logo"
            className="w-32 h-32 md:w-40 md:h-40 object-cover mb-6 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            {t("login.main_title")}
          </h1>
          <p className="text-gray-200 text-base mb-2">
            {t("login.description")}
          </p>
          <p className="text-gray-300 text-sm">
            {t("login.short_description")}
          </p>
        </div>

        {/* Oq forma qismi */}
        <form className="flex flex-col justify-center p-8 md:p-10 w-full md:w-1/2 bg-white rounded-r-xl" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-6 text-gray-700">
            {t("login.title")}
          </h2>
          {/* Username */}
          <div className={`mb-4 ${errors.username ? "animate-shake" : ""}`}>
            <div className="relative">
              <FaUser
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={t("login.username")}
                {...register("username")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none transition 
                ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div className={`mb-6 ${errors.password ? "animate-shake" : ""}`}>
            <div className="relative">
              <FaLock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("login.password")}
                {...register("password")}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition 
                ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 h-10 flex items-center justify-center bg-[#0c2540] text-white rounded-lg font-semibold hover:bg-[#112f4d] transition shadow-md"
          >
            {isPending ? <ButtonLoader /> : t("login.submit")}
          </button>
          {/* Qo‘shimcha linklar */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <a href="#" className="hover:underline">
              {t("login.reset")}
            </a>
            {/* <a href="#" className="hover:underline">
            {t("login.register")}
          </a> */}
          </div>{" "}
        </form>
      </div>
    </div>
  );
}
