var clique = document.querySelector('#sortear')
clique.addEventListener('click', async function(){const exec = await showMovies()})

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
  // pegar categorias
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  
  let catEscID = catRandom()
  if(!catEscID.fulfilled){
    catEscID = await catRandom()
  }else{
    // pegar o nome das categorias selecionadas anteriormente
    var generoNome =[]
    console.log(catEscID)
    for(let p=0;p<19;p++){
      if(catEscID.includes(catData.genres[p].id)){
        generoNome.push(catData.genres[p].name)
      }
    }
    console.log(generoNome)
  }

  


  
  var choice = document.getElementById("movFilter").value
  
  // pegar filmes
  if(choice=="ppl"){
    var filme = "https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR"
    var filmeResponse = await fetch(filme)
    var filmeData = await filmeResponse.json()

    var generoID = filmeData.results.genre_ids //pegar id do genero do filme popular

    
    var img = filmeData.results.poster_path
    var imgURL = "https://image.tmdb.org/t/p/w500"+img+"?api_key=5bb8005de7fd8012a01a757e91ccf015" //colocar no src
  
    
    
  }
  
  
  
}
