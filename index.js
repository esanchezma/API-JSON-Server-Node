const http = require("http");
const path = require("path");
const fs = require("fs/promises");
const PORT = 8000;

// Funcion que Escribe en el Archivo
const writtingFile = async (jasonPath, arr) => {
  await fs.writeFile(jasonPath, JSON.stringify(arr));
};
 

// Funcion Crea el Servidor 

const app = http.createServer(async (request, response) => {  
  //Leer el metodo de la petición GET POST PUT etc..
  const requestURL = request.url;
  const requestMethod = request.method;
  // imprimir ruta y metodo de la peticion
  // console.log(requestURL, requestMethod);
  //responder el data.json cuando se realice un GET al endpoint /apiv1/tasks
  const jasonPath = path.resolve("./data.json");

  const jsonFile = await fs.readFile(jasonPath, "utf-8"); // ARCHIVO original

  if (requestURL === "/apiv1/tasks/" && requestMethod === "GET") {
    // responder con data.jason
    response.setHeader("Content-Type", "application/json");
    response.writeHead(200);
    response.write(jsonFile);
  }
  if (requestURL === "/apiv1/tasks/" && requestMethod === "POST") {
    // si existe "data" entonces ejecuta la funcion como parametro data
    request.on("data", async (data) => {
      // escribir en el archivo
      let arr = JSON.parse(jsonFile);
      //Leer el POST en consola
      arr = arr.sort((a, b) => a.id - b.id);
      console.log(arr);
      const id = arr[arr.length - 1].id;
      const newTask = JSON.parse(data); // obtener info
      // ruta del archivo linea 15 jasonPath
      // leer el archivo linea 16 jsonFile
      newTask.id = id + 1;
      arr.push(newTask);
      console.log(arr);
      await writtingFile(jasonPath, arr);
    });
    response.setHeader("Content-Type", "application/json");
    response.writeHead(201);
  }
  //http://localhost:8000/apiv1/tasks/id
  if (requestURL.includes("/apiv1/tasks/") && requestMethod === "PUT") {
    const splitUrl = requestURL.split("/");
    const id = Number(splitUrl[splitUrl.length-1])    
    let arr = JSON.parse(jsonFile);
    response.setHeader("Content-Type", "application/json");
    response.writeHead(201);
    request.on("data", async(data)=>{
      data = JSON.parse(data);  // objeto que voy a modificar
     const newArr = arr.map((task)=>{
       if (task.id === id){
        task.status = data.status
       }
       return task
      });
      await writtingFile(jasonPath, newArr);
      console.log(newArr)
    });
    console.log(splitUrl);
    console.log(id);
    console.log(requestURL.includes("/apiv1/tasks/"));
  }
  if (requestURL.includes("/apiv1/tasks/") && requestMethod === "DELETE") {
    const splitUrl = requestURL.split("/");
    const id = Number(splitUrl[splitUrl.length-1]);
    let arr = JSON.parse(jsonFile);
    response.setHeader("Content-Type", "application/json");
    response.writeHead(201);
    const arrayfiltered = arr.filter(task => task.id !== id );
    await writtingFile(jasonPath, arrayfiltered);

    
  }
  if (requestURL!== "/apiv1/tasks/" && !requestURL.includes("/apiv1/tasks/") ) {  
     //response.writeHead(404);
  }
  response.end();
});
app.listen(PORT);
console.log(`Corriendo PORT ${PORT}`);
