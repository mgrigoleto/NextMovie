async function catRandom(){
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  var catQtd = document.getElementById("catInput").value
  var categorias=[]
  var idCategorias=[]

  // remover os anteriores
  for(var j=0; j<19; j++){
    const catExistente = document.getElementById("c")
    if(catExistente){
      catExistente.remove();      
    }
  }
  
  while(categorias.length<catQtd){
    var catRandom = Math.floor(Math.random()*19)//há 19 categorias registradas no json
    var catName = catData.genres[catRandom].name
    var catID = catData.genres[catRandom].id
    console.log(catName)
    console.log(catID)
    if(!categorias.includes(catName)){
      categorias.push(catName)
      idCategorias.push(catID)
    }    
  }
  for(var j=0; j<categorias.length; j++){
      document.getElementById("cat").insertAdjacentHTML("afterbegin","<div class='catItem' id='c'><p><b>"+categorias[j]+"<b></p></div>")
  }
  return idCategorias
}

async function showMovies(){
  // pegar categoria
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  var catID = await catRandom()

  // pegar filmes
  var filme = "https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR"
  var filmeResponse = await fetch(filme)
  var filmeData = await filmeResponse.json()
  var img = filmeData.results.poster_path
  var imgURL = "https://image.tmdb.org/t/p/w500"+img+"?api_key=5bb8005de7fd8012a01a757e91ccf015"
}
