import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import UserPages from './pages/user-pages/UserPages'
import loadable from "@loadable/component";
import PageNotFound from './components/PageNotFound';

import { setupInterceptorsTo } from "./interceptors/axios.interceptor";
import axios from "axios";
import globalRouter from './services/globalRouter';
setupInterceptorsTo(axios);

const Dashboard = loadable(() => import("./pages/user-pages/Dashboard/Dashboard"))
const Transactions = loadable(() => import("./pages/user-pages/Transactions/Transactions"))
const Analysis = loadable(() => import("./pages/user-pages/Analysis/Analysis"))
const SplitBill = loadable(() => import("./pages/user-pages/SplitBill/SplitBill"))
const CategoryList = loadable(() => import("./pages/user-pages/CategoryList/CategoryList"))
const SignUp = loadable(() => import("./pages/auth/SignUp"))
const UserVerification = loadable(() => import("./pages/auth/UserVerification"))

function App() {

  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return (
    <Routes>
      <Route path="login" element={<Login />}></Route>
      <Route path="sign-up" element={<SignUp />}></Route>
      <Route path="reset-password" element={<UserVerification />}></Route>
      <Route path="email-verification" element={<UserVerification />}></Route>
      <Route path='pages' element={<UserPages />}>
        <Route path="dashboard" element={<Dashboard />}></Route>
        <Route path="transactions" element={<Transactions />}></Route>
        <Route path="analysis" element={<Analysis />}></Route>
        <Route path="split-bill" element={<SplitBill />}></Route>
        <Route path="category-list" element={<CategoryList />}></Route>
      </Route>
      <Route path='' element={<Login />}></Route>
      <Route path='*' element={<PageNotFound />}></Route>
    </Routes>
  )
}

export default App
