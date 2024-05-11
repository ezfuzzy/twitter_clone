import { Outlet, useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import { Link } from "react-router-dom"
import { auth } from "../routes/firebase"

const Wrapper = styled.div` display: grid; gap: 50px; grid-template-columns:1fr 4fr; padding: 50px 0px; height:100%; width:100%; max-width:860px; `;

const Menu = styled.div` display:flex; flex-direction: column; align-items: center; gap: 20px; `;

const MenuItem = styled.div` cursor:pointer; display: flex; align-items: center; justify-content: center; border: 2px solid white; height: 50px; width: 50px; border-radius: 50%; svg { width: 30px; fill: white; } &.log-out { border-color: tomato; svg { fill: tomato; }}`;

export default function Layout() {
  const navigate = useNavigate();
  const onLogOut = async() => {
    const ok = confirm("do logout?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  }
  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>  {/* home  */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
            </svg>
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>  {/* profile  */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" clipRule="evenodd" />
            </svg>
          </MenuItem>
        </Link>
        <MenuItem onClick={onLogOut} className="log-out">  {/* logout  */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" clipRule="evenodd" />
          </svg>
        </MenuItem>
      </Menu>
      <Outlet /> 
    </Wrapper>
  );
}