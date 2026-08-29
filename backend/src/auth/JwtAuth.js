// Import jsonwebtoken so we can verify JWTs
import jwt from "jsonwebtoken";


// Create a custom Hapi authentication scheme
const jwtAuth = () => {
  return {

    // Hapi runs this function before allowing access to a protected route
    authenticate: (request, h) => {

      // Get the Authorization header from the request
      const authorization = request.headers.authorization;

      // Check that an Authorization header was provided
      if (!authorization) {
        return h
          .response({
            message: "Authentication required",
          })
          .code(401)
          .takeover();
      }


      // The header looks like:
      // Bearer eyJhbGciOiJIUzI1Ni...
      // We only need the token after "Bearer "
      const token = authorization.replace("Bearer ", "");


      try {
        // Check that the JWT is valid using our secret
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );


        // Authentication succeeded
        // Save the information from the JWT as credentials
        return h.authenticated({
          credentials: decoded,
        });

      } catch (error) {

        // The token was invalid or expired
        return h
          .response({
            message: "Invalid or expired token",
          })
          .code(401)
          .takeover();
      }
    },
  };
};


export default jwtAuth;