import React from "react";
import { Redirect, Route } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem("avangartAuthToken") ? (
        // <Redirect
        //     to={{
        //     pathname: "/user",
        //     state: { from: props.location },
        //     }}
        // />
        <Component {...props} />
      ) : (
        <Component {...props} />
      )
    }
  />
);
