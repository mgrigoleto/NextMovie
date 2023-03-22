var clique = document.querySelector('#sortear')
clique.addEventListener('click', async function(){const exec = await showMovies()})

async function getGeneros(){
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  return catData
}

async function getFilmes(url){
  var filme = url
  var filmeResponse = await fetch(filme)
  var filmeData = await filmeResponse.json()
  return filmeData
}

async function catRandom(){
  var catData = await getGeneros()
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
  
  // verificação pra colocar o título uma vez só
  const catTitle = document.getElementById("t")
  if(!catTitle){    
    document.getElementById("cat").insertAdjacentHTML("beforebegin","<h3 class='centerTitle' id='t'>Categorias:</h3>")// colocar a palavra categorias
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
  
  var choice = document.getElementById("movFilter").value
  var filmeData

  // verificação pra colocar o título uma vez só
  const filmeTitle = document.getElementById("tt")
  if(!filmeTitle){    
    document.getElementById("filmao").insertAdjacentHTML("beforebegin","<h3 class='centerTitle' id='tt'>Filmes:</h3>")// colocar a palavra filmes
  }
  
  if(choice=="populares"){
    filmeData = await getFilmes("https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR")    
  }else if(choice=="recentes"){
    // filmeData = await getFilmes("https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR")
  }else if(choice=="melhorav"){
    // filmeData = await getFilmes("https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR")
  }
  buildMovie(filmeData)
}

async function buildMovie(filmeData){
  let catData = await getGeneros()// pegar categorias da api
  let catEscID = await catRandom()// pegar os IDs das categorias que foram sorteadas

  let generoResult = []
  
  // percorrer o json e comparar os IDs dos gêneros da API com os gêneros escolhidos aleatoriamente
  for(let r=0;r<20;r++){// percorre os 20 resultados de filmes
    var gens = ""// armazenar os nomes dos filmes
    
    for(let g=0;g<5;g++){// percorre o vetor de gêneros dentro do resultado
      if(filmeData.results[r].genre_ids[g]){// verifica se há gênero no resultado
        generoResult.push(filmeData.results[r].genre_ids[g])

        for(let n=0;n<18;n++){// percorre o vetor dos gêneros
          if(catData.genres[n].id == generoResult[g]){
            if(gens == ""){
              gens = catData.genres[n].name
            }else{
              gens = gens + ", " + catData.genres[n].name
            }
          }
        }
        
      }
      for(let x=0;x<generoResult.length;x++){
        if(catEscID.includes(generoResult[x])){// verifica se algum dos gêneros do filme é igual a algum selecionado
          var match = true
        }
      }
      
    }
    if(match == true){// caso o filme possua um gênero que foi sorteado anteriormente
      match = false // para a validação funcionar da próxima vez
      //
      //
      //
      // MONTAR O FILME AQUI
      //
      //
      //
      console.log("TRUE\n.")
    }
    
    console.log(generoResult)
    console.log(gens)
    generoResult.splice(0, generoResult.length)
    gens = ""
    
  }
  var img = filmeData.results.poster_path
  var imgURL = "https://image.tmdb.org/t/p/w500"+img+"?api_key=5bb8005de7fd8012a01a757e91ccf015" //colocar no src 
}

