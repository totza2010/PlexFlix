import LoginPage from "components/LoginPage/LoginPage";
import Router from "next/router";
import { getSession } from "next-auth/react";

const Login = () => {
  return <LoginPage />;
};

export const getServerSideProps = async (ctx) => {
  const data = await getSession(ctx);

  if (data) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { location: "/profile" });
      ctx.res.end();
      return {
        props: {
          signedIn: true
        }
      };
    } else {
      Router.push("/profile");
      return {
        props: {
          signedIn: true
        }
      };
    }
  } else {
    return {
      props: {
        signedIn: false
      }
    };
  }
};

export default Login;
