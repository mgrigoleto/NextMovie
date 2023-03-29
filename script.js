var clique = document.querySelector('#sortear')
clique.addEventListener('click', async function() { const exec = await showMovies() })

async function getGeneros() {
  var catURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR"
  var catResponse = await fetch(catURL)
  var catData = await catResponse.json()
  return catData
}

async function getFilmes(url,page,region) {
  var filmeResponse = await fetch(url+page+region)
  var filmeData = await filmeResponse.json()
  return filmeData
}

async function catRandom() {

  // remover os gêneros anteriores
  for (var j = 0; j < 19; j++) {
    const catExistente = document.getElementById("c")
    if (catExistente) {
      catExistente.remove();
    }
  }

  var catData = await getGeneros()
  var catQtd = document.getElementById("catInput").value
  var categorias = []
  var idCategorias = []

  // verificação pra colocar o título uma vez só
  const catTitle = document.getElementById("t")
  if (!catTitle) {
    document.getElementById("cat").insertAdjacentHTML("beforebegin", "<h3 class='centerTitle' id='t'>Categorias:</h3>")// colocar a palavra categorias
  }

  while (categorias.length < catQtd) {// pegar categorias aleatórias
    var catRandom = Math.floor(Math.random() * 19)//há 19 categorias registradas no json
    var catName = catData.genres[catRandom].name
    var catID = catData.genres[catRandom].id
    if (!categorias.includes(catName)) {
      categorias.push(catName)
      idCategorias.push(catID)
    }
  }
  for (var j = 0; j < categorias.length; j++) {
    document.getElementById("cat").insertAdjacentHTML("afterbegin", "<div class='catItem' id='c'><p><b>" + categorias[j] + "<b></p></div>")
  }
  return idCategorias
}

async function showMovies() {

  // remover os gêneros anteriores
  for (var j = 0; j < 20; j++) {// há no máximo 20 resultados
    const filmeExistente = document.getElementById("f")
    if (filmeExistente) {
      filmeExistente.remove();
    }
  }

  // verificação pra colocar o título uma vez só
  const filmeTitle = document.getElementById("tt")
  if (!filmeTitle) {
    document.getElementById("filmao").insertAdjacentHTML("beforebegin", "<h3 class='centerTitle' id='tt'>Filmes:</h3>")// colocar a palavra filmes
  }

  // montar URL
  let region = "&region=BR"
  
  const pop = "https://api.themoviedb.org/3/movie/popular?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page="
  const rec = "https://api.themoviedb.org/3/movie/now_playing?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page="
  const bst = "https://api.themoviedb.org/3/movie/top_rated?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page="
  const apv = "https://api.themoviedb.org/3/movie/upcoming?api_key=5bb8005de7fd8012a01a757e91ccf015&language=pt-BR&page="


  // executa a função para mostrar os filmes com base em uma página aleatória retornada pela API
  let pagePopBst = Math.floor(Math.random() * 50) + 1//pega uma página aleatória de 1 a 50
  let pageRec = Math.floor(Math.random() * 4) + 1//pega uma página aleatória de 1 a 3
  
  var choice = document.getElementById("movFilter").value
  let filmeData
  if (choice == "populares") {//possui mais de 50 páginas de resultado
    filmeData = await getFilmes(pop,pagePopBst,region)
  }else if (choice == "recentes") {//possui apenas 4 páginas de resultado
    filmeData = await getFilmes(rec,pageRec,region)
  }else if (choice == "melhorav") {//possui mais de 50 páginas de resultado
    filmeData = await getFilmes(bst,pagePopBst,region)
  }else if (choice == "aindapv") {//possui apenas 1 página de resultado
    filmeData = await getFilmes(apv,1,region)
  }
  await buildMovie(filmeData)

  
}

async function buildMovie(filmeData) {
  const erroFilme = document.getElementById("w")
  if(erroFilme){
    erroFilme.remove()
  }
  
  let catData = await getGeneros()// pegar categorias da api
  let catEscID = await catRandom()// pegar os IDs das categorias que foram sorteadas

  let generoResult = [] //vetor para armazenar os gêneros do filme sorteado
  let noRepeat = [] //vetor para evitar que apareça mais de um filme por gênero
  
  //vetor para evitar que o mesmo filme seja sorteado 2 vezes caso satisfaça 2 categorias sorteadas
  //Armazena as categorias que conseguiram possuem um filme sorteado
  let filmesID = [] 

  let existeFilme = false //torna-se verdadeiro caso algum filme seja encontrado
  

  // percorrer o json e comparar os IDs dos gêneros da API com os gêneros escolhidos aleatoriamente
  for (let r = 0; r < filmeData.results.length; r++) {// percorre os 20 resultados de filmes
    var gens = ""// armazenar os nomes dos filmes

    for (let g = 0; g < filmeData.results[r].genre_ids.length; g++) {// percorre o vetor de gêneros dentro do resultado
      if (filmeData.results[r].genre_ids[g]) {// verifica se há gênero no resultado
        generoResult.push(filmeData.results[r].genre_ids[g])

        for (let n = 0; n < 18; n++) {// percorre o vetor dos gêneros
          if (catData.genres[n].id == generoResult[g]) {
            if (gens == "") {
              gens = catData.genres[n].name
            } else {
              gens = gens + ", " + catData.genres[n].name
            }
          }
        }

      }
      for (let x = 0; x < generoResult.length; x++) {
        if (catEscID.includes(generoResult[x]) && !(noRepeat.includes(generoResult[x]))) {// verifica se algum dos gêneros do filme é igual a algum selecionado e se ele o filme não foi selecionado antes
          noRepeat.push(generoResult[x])
          console.log(noRepeat)
          var match = true
          existeFilme = true
        }
      }
    }
        
    var img = filmeData.results[r].poster_path
    var imgURL = "https://image.tmdb.org/t/p/w500" + img + "?api_key=5bb8005de7fd8012a01a757e91ccf015" //colocar no src
    var titulo = filmeData.results[r].title
    var sinopse = filmeData.results[r].overview
    var nota = filmeData.results[r].vote_average
    
    var dataAPI = filmeData.results[r].release_date
    let partesData = dataAPI.split('-');
    let dataFormatada = `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    

    if (match == true && !(filmesID.includes(filmeData.results[r].id))) {// caso o filme possua um gênero que foi sorteado anteriormente e não tenha sido apresentado antes
      match = false // para a validação funcionar da próxima vez

      filmesID.push(filmeData.results[r].id)// armazena no vetor o ID do filme que foi sorteado

      document.getElementById("filmao").insertAdjacentHTML("afterend", "<div class='filme' id='f'> <div class='filmeFoto'>" +
        "<p id='titulo'>" + titulo + "</p>" +
        "<img class='poster' src='" + imgURL + "'>" +
        "</div> <div class='filmeInfo'> <p><b>Gêneros:</b> " + gens + "</p>" +
        "<p id='sinopse'><b>Sinopse:</b> " + sinopse + "</p>" +
        "<p><b>Data de Lançamento:</b> " + dataFormatada + "</p> <p><b>Média:</b> " + nota + "</p> </div> </div>")

      showMoreSinopse()
    }

    generoResult.splice(0, generoResult.length)
    gens = ""

  }//final do for de 20 repetições
  if(existeFilme == false){
    document.getElementById("filmao").insertAdjacentHTML("afterend","<center><p id='w'>Não foi encontrado nenhum filme das categorias sorteadas!</p></center>")
  }
}

function showMoreSinopse(){
  const sinopse = document.getElementById("sinopse")
  const sinopseSize = sinopse.textContent.length

  if(sinopseSize > 300){
    const sinopseTexto = sinopse.textContent
    const sinopseResumida = sinopseTexto.slice(0, 300)
    const verMais = document.createElement("span")
    
    verMais.textContent = " ...ver mais"
    verMais.classList.add("verMais")
    sinopse.textContent = sinopseResumida
    sinopse.appendChild(verMais)
    verMais.addEventListener("click", function(){
      sinopse.textContent = sinopseTexto
    })
  }
}