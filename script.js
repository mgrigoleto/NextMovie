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
  
  // remover os gêneros anteriores
  for(var j=0; j<19; j++){
    const catExistente = document.getElementById("c")
    if(catExistente){
      catExistente.remove();
    }
  }
  
  var catData = await getGeneros()
  var catQtd = document.getElementById("catInput").value
  var categorias=[]
  var idCategorias=[]
  
  // verificação pra colocar o título uma vez só
  const catTitle = document.getElementById("t")
  if(!catTitle){    
    document.getElementById("cat").insertAdjacentHTML("beforebegin","<h3 class='centerTitle' id='t'>Categorias:</h3>")// colocar a palavra categorias
  }
  
  while(categorias.length<catQtd){// pegar categorias aleatórias
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
  
  // remover os gêneros anteriores
  for(var j=0; j<20; j++){// há no máximo 20 resultados
    const filmeExistente = document.getElementById("f")
    if(filmeExistente){
      filmeExistente.remove();
    }
  }
  
  var choice = document.getElementById("movFilter").value
  var filmeData

  // verificação pra colocar o título uma vez só
  const filmeTitle = document.getElementById("tt")
  if(!filmeTitle){    
    document.getElementById("filmao").insertAdjacentHTML("beforebegin","<h3 class='centerTitle' id='tt'>Filmes:</h3>")// colocar a palavra filmes
  }

  const pop = "https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR"
  const rec = "https://api.themoviedb.org/3/movie/now_playing?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR"
  const bst = "https://api.themoviedb.org/3/movie/top_rated?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page=1&region=BR"
  
  if(choice=="populares"){
    filmeData = await getFilmes(pop)    
  }else if(choice=="recentes"){
    filmeData = await getFilmes(rec)
  }else if(choice=="melhorav"){
    filmeData = await getFilmes(bst)
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
    
    var img = filmeData.results[r].poster_path
    var imgURL = "https://image.tmdb.org/t/p/w500"+img+"?api_key=5bb8005de7fd8012a01a757e91ccf015" //colocar no src
    var titulo = filmeData.results[r].title
    var sinopse = filmeData.results[r].overview
    var dataAPI = filmeData.results[r].release_date

    let partesData = dataAPI.split('-');
    let dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    var nota = filmeData.results[r].vote_average
    
    if(match == true){// caso o filme possua um gênero que foi sorteado anteriormente
      match = false // para a validação funcionar da próxima vez

      document.getElementById("filmao").insertAdjacentHTML("afterend","<div class='filme' id='f'> <div class='filmeFoto'>"+
                                                           "<p id='titulo'>"+titulo+"</p>"+
        "<img class='poster' src='"+imgURL+"'>"+
        "</div> <div class='filmeInfo'> <p><b>Gêneros:</b> "+gens+"</p>"+
        "<p><b>Sinopse:</b> "+sinopse+"</p>"+
        "<p><b>Data de Lançamento:</b> "+dataFormatada+"</p> <p><b>Média:</b> "+nota+"</p> </div> </div>")
    }
    
    generoResult.splice(0, generoResult.length)
    gens = ""
    
  }
   
}

