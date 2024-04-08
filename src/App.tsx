import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import UserPages from './pages/user-pages/UserPages'
import loadable from "@loadable/component";
import PageNotFound from './components/PageNotFound';

const EmailVerification = loadable(() => import("./pages/EmailVerification"))
const Dashboard = loadable(() => import("./pages/user-pages/Dashboard/Dashboard"))
const Transactions = loadable(() => import("./pages/user-pages/Transactions/Transactions"))
const Analysis = loadable(() => import("./pages/user-pages/Analysis/Analysis"))
const SplitBill = loadable(() => import("./pages/user-pages/SplitBill"))
const CategoryList = loadable(() => import("./pages/user-pages/CategoryList"))

function App() {

  return (
    <Routes>
      <Route path="login" element={<Login />}></Route>
      <Route path="email-verification" element={<EmailVerification />}></Route>
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
