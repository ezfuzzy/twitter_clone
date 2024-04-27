import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <>
            <h2>layout</h2> 
            {/* ^ become navigation bar >> home & profile should be rendered at same time  */}
            <Outlet /> 
            {/* step00 Outlet 은 각각  home과 profile로 대체됨 (path에 맞게) */}
        </>
    );
}