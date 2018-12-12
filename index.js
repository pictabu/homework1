var http=require('http');
var url=require('url');
var StringDecoder=require('string_decoder').StringDecoder;
//Creamos el servidor
var httpServer=http.createServer(function(req,res){
  //Empezamos a recoger data
  //we set the second argument to true to parse as well the query
  //ex: ?foo=cualquiera...if we set it to true...it wil display {foo:'hay'}
  var parsedUrl=url.parse(req.url,false);
  var path=parsedUrl.pathname;
  var trimmedPath=path.replace(/^\/+|\/+$/g,'');
  var queryStringObject=parsedUrl.query;
  var headers=req.headers;
  var method=req.method.toLowerCase();
  var decoder=new StringDecoder('utf-8');
  var buffer='';
  req.on('data',function(data){
    buffer=buffer+decoder.write(data);
  });
  req.on('end',function(){
    buffer=buffer+decoder.end();
    var chosenHandler=typeof(router[trimmedPath])!=='undefined'?router[trimmedPath]:handlers.notFound;
    var data={
      'trimmedPath':trimmedPath,
      'queryStringObject':queryStringObject,
      'method':method,
      'headers':headers,
      'payload':buffer
    };

    chosenHandler(data,function(statusCode,payload){
      statusCode=typeof(statusCode)=='number'?statusCode:200;
      payload=typeof(payload)=='object'?payload:{};
      var jsonPayloads=JSON.stringify(payload);
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(jsonPayloads);
    });

  });
});
//Empezamos el servidor
httpServer.listen(3000,function(){
  console.log('Estamos escuchando puerto 3000');
});

//Definimos los handlers
var handlers={};
handlers.notFound=function(data,callback){
  callback(404);
};
handlers.hello=function(data,callback){
  callback(406,{'greeting':'hello'});
};
var router={
  'hello':handlers.hello
};
