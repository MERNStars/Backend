let jwt = require( 'jsonwebtoken' );

//authenticate if the user has a valid token
let checkToken = (req, res, next) =>{
  // const {username} = req.params;
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] ||
              req.headers['authorization'] || "";
  // An empty string allows the token to be treated as a string but will return false
  if( token.startsWith( 'Bearer ' ) ){
    // Remove Bearer from string
    token = token.slice( 7, token.length );
  }
  if( token ){    
    // Pass in the token and the secret key into verify()
    jwt.verify( token, process.env.TOKEN_SECRET, (err, decoded) =>{ 
      if( err ){
        return res.json({
          success: false,
          message: err.message
        } );
      }//check if someone else is trying to edit someone else information
      else /*if(username === decoded['username'])*/{
        req.decoded = decoded;
        next();
      } /*
      else{
        return res.json(
          {
            success: false,
            status: 403,
            message: "You don't have the right to edit someone else information"
          } );
      }*/
    } );
  }
  else{
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    } );
  }
};

//Authenticate if the user has the admin rights
let checkAdminToken = (req, res, next) =>{
  // Express headers are auto converted to lowercase
  let token = req.headers['x-access-token'] ||
              req.headers['authorization'] || "";
  // An empty string allows the token to be treated as a string but will return false
  if( token.startsWith( 'Bearer ' ) ){
    // Remove Bearer from string
    token = token.slice( 7, token.length );
  }
  if( token ){
    // Pass in the token and the secret key into verify()
    jwt.verify( token, process.env.TOKEN_SECRET, (err, decoded) =>{
      if( err ){
        return res.json({
          success: false,
          status: 400,
          message: err.message
        } );
      }//check if user has the admin right even if the token is valid
      else if(decoded['isAdmin']){
        req.decoded = decoded;
        next();
      }
      else{//user doesn't have the admin privilege
        return res.json({
            success: false,
            status: 403,
            message: "You don't have the admin rights"
          } );
      }
    } );
  }
  else{
    return res.json({
      success: false,
      status: 401,
      message: 'Auth token is not supplied'
    } );
  }
};

module.exports =
{
  checkToken: checkToken,
  checkAdminToken: checkAdminToken
}