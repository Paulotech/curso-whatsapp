/*
* Script controlador do fundo e seus assets
* @author Everton Cesario <everton.cesario@webaula.com.br> 01/01/2016
*/

window.onload = init;
window.onbeforeunload = window.onpagehide = window.onunload = fechouJanela;

try {
	window.frameElement.setAttribute("allowfullscreen", "");
} catch (erro) {}


// Armazena a API se houver
var api = findAPI(window);
var habilitaConsole = true;
var frame = 0;

// Assets e Fundo
var totalCenas;
var video, cenaAtual, tentativa_atual = 0, pontuacao;
var conteudo, question, abertura, quadro, next_f, encerramento, interval;

function init(){
	conteudo = document.querySelector("#conteudo");
	question = conteudo.querySelector("#pergunta");
	abertura = conteudo.querySelector("#abertura");
	encerramento = conteudo.querySelector("#encerramento");
	quadro = conteudo.querySelector(".quadro");

	if (api != null) {
		loadPage();

		verificaScorm();
	} else {
		loadApp();
	}	
}

function fechouJanela(event) {
	window.onbeforeunload = null;
	window.onpagehide = null;
	window.onunload = null;

	if (api != null) {
		unloadPage();								
	}
}

function verificaScorm() {
	if (LMSIsInitialized()) {
		loadApp();
	} else {
		setTimeout(verificaScorm, 200);
	}
}

function loadApp() {	
	var rodaLMS = api;	
	
	// Armazena os dados gravados no LMS
	var lessonLocation = getLMSValue("cmi.core.lesson_location");
	var lessonStatus = getLMSValue("cmi.core.lesson_status");
	var studentName = getLMSValue("cmi.core.student_name");
	var suspendData = getLMSValue("cmi.suspend_data");			
	
	separaDadosLMS();
	
	function getLMSValue(campo) {
		if (rodaLMS) {
			return doLMSGetValue(campo);
		}

		return "";
	}

	function setLMSValue(campo, valor, commit) {
		var resultado = "";
		if (rodaLMS) {
			resultado = doLMSSetValue(campo, valor);

			if (commit) {
				doLMSCommit();
			}
		}
		return resultado;
	}

	function separaDadosLMS() {		
		totalCenas = estrutura.cenas.length;
		pontuacao = new Array();
		
		if (lessonLocation === "") {
			cenaAtual = 0;
		} else {
			habilitaConsole ? console.log("Dados do LMS encontrados. Separando...") : "";

			if (lessonStatus !== "completed") {				
				cenaAtual = lessonLocation != "" ? (~~lessonLocation.split(";")[0])-1 : 0;
				pontuacao = lessonLocation != "" ? lessonLocation.split(";")[1].split(",") : pontuacao;	
				var pontos = lessonLocation != "" ? lessonLocation.split(";")[2] : 0;				

				if (cenaAtual >= totalCenas) {
					cenaAtual = totalCenas;
				}										
			}else{
				cenaAtual = 0;
			}
		}
					
		setTimeout(carregaVideo, 100);
	}
	
	function carregaVideo(){	
		video = document.querySelector("#video");	
		verificaEstrutura();	
	}

	function verificaEstrutura(){	
		
		// estrutura.cenas[cenaAtual].video === "none" ? "" : video.src = estrutura.cenas[cenaAtual].video;	
		
		// abertura.querySelector("#btn_action").addEventListener("click", () => {
		// 	console.log("É nois que avoa bruxão !!!");
		// 	abertura.classList.add("d-none");
		// 	quadro.classList.add("d-none");
		// });	

		estrutura.cenas[cenaAtual].video === "none" ? "" : video.src = estrutura.cenas[cenaAtual].video;	
		video.dataset.id = estrutura.cenas[cenaAtual].id;
		video.type = estrutura.type;
		abertura.querySelector("#btn_action").addEventListener("click", executaVideo);	
		video.addEventListener("ended", finalizaVideo);		

		addSourceToVideo( video, "http://video-js.zencoder.com/oceans-clip.ogv", "video/ogv");
	    addSourceToVideo( video, "http://video-js.zencoder.com/oceans-clip.mp4", "video/mp4");
		
		checkforVideo(0);
	}

	function checkforVideo(cena) {		
		var VideoElement = document.createElement("video");
		VideoElement.src = estrutura.cenas[cena].video;		

	    var b = setInterval(()=>{
	        if(VideoElement.readyState >= 3){	            
	            clearInterval(b);
	            if (cena < totalCenas-1){
	            	//VideoElement.currentTime = 0;
	            	checkforVideo(cena +1);
	            }
	        }                   
	    },500);
	}
	
 	function addSourceToVideo(element, src, type) {
	    var source = document.createElement('source');

	    source.src = src;
	    source.type = type;

	    element.appendChild(source);
	}

	function executaVideo(e){				
		e.currentTarget.removeEventListener("click", executaVideo);
		conteudo.querySelector("#btn_action").addEventListener("click", pausaVideo);
		conteudo.querySelector("#btn_action").classList.add("pause");
		conteudo.querySelector("#btn_action").classList.add("player");
		conteudo.querySelector("#btn_action").classList.remove("d-none");				
		abertura.classList.add("d-none");
		quadro.classList.add("d-none");

		if (video.src === ""){
			habilitaAcao();
		}else{							
			video.play();
		}		
	}
	
	function playVideo(src){
		gravaDados();
		
		video.src = src;			
		video.dataset.id = estrutura.cenas[cenaAtual].id;
		video.play();		
	}

	function reverVideo(){
		clearInterval(interval);
		habilitaIcone(false);
		question.classList.add("d-none");
		question.innerHTML = "";
		quadro.classList.add("d-none");
		
		playVideo(estrutura.cenas[cenaAtual].video);
	}

	function pausaVideo(e){
		e.currentTarget.removeEventListener("click", pausaVideo);
		e.currentTarget.addEventListener("click", executaVideo);		
		e.currentTarget.classList.remove("pause");
		video.pause();	
	}

	function finalizaVideo(e){		
		fimVideo();
		
		console.log("finalizaVideo", e.currentTarget.dataset.proximo, cenaAtual);
		if (estrutura.cenas.length != (cenaAtual+1)){			
			if (e.currentTarget.dataset.proximo != null && e.currentTarget.dataset.proximo != "null" && e.currentTarget.dataset.proximo != undefined && e.currentTarget.dataset.proximo != "false"){								
				habilitaContinuar(e.currentTarget.dataset.proximo);	

			}else if (e.currentTarget.dataset.proximo == undefined || e.currentTarget.dataset.proximo == "null" || e.currentTarget.dataset.proximo == null){

				if(frame + 1 <= estrutura.whatsapp.length ) {
					console.log(e.currentTarget.dataset.proximo)
					telaWhatsapp();
				} else {
					habilitaAcao();
				}
			}else{
				habilitaContinuar();				
			}
		} else {
			encerramento.classList.remove("d-none");
			quadro.classList.remove("d-none");
			conteudo.querySelector("#btn_action").classList.add("d-none");
		}
	}

	// Gambis
	function telaWhatsapp() {
		var ElementWhatsapp = conteudo.querySelector(".janela-whatsapp");
		var video = conteudo.querySelector("#video");
		var btn = conteudo.querySelector("#btn_action");

		video.classList.add("d-none");
		btn.classList.add("d-none");
		ElementWhatsapp.classList.remove("d-none");

		
			var $dialogo = ElementWhatsapp.querySelector(".dialogo-whatsapp");
			var elementPgt = estrutura.whatsapp[frame].texto;
			
			var $balao = document.createElement("div");
			var $balaoCentro = document.createElement("div");
			var $pgt = document.createElement("p");
			
			// var audio = document.querySelector();
			

			
			$balao.classList.add("balao-e");
			$balaoCentro.classList.add("balao-center");
			
			$pgt.innerHTML = elementPgt;
			$balao.appendChild($pgt);
			setTimeout(function(){
				// audio.play();
				$dialogo.appendChild($balao);
				$dialogo.appendChild($balaoCentro);
			}, 2000) 
			
			
			montaOpcoes(frame);
	}

	function montaOpcoes(frame) {
		var $respostas = conteudo.querySelectorAll(".janela-whatsapp .rodape-whatsapp .res");
		var $indicacao = conteudo.querySelector(".janela-whatsapp .rodape-whatsapp .indicacao");
		var element = estrutura.whatsapp[frame];
		
		setTimeout(function(){
			for (var i = 0; i < element.opcoes.length; i++) {

				var opcao = element.opcoes[i];
				var $opcao = document.createElement("p");
				
				$indicacao.classList.remove('d-none');
				
				
				$opcao.innerHTML = opcao;
				$opcao.classList.add("opcao" + ([i + 1]));
				$respostas[i].appendChild($opcao);
				$respostas[i].querySelector("p").addEventListener('click', function() {
					var ele = this;
					
					for (let i = 0; i < $respostas.length; i++) {
						const elemento = $respostas[i];
						elemento.querySelector("p").remove("opcao" + [ i + 1 ]);
					}
					$indicacao.classList.add('d-none');
					montaTela(ele, frame);
				})
				
			}
		}, 3000) 
	}
	
	function montaTela(ele) {
		var ElementWhatsapp = conteudo.querySelector(".janela-whatsapp");
		var $dialogo = ElementWhatsapp.querySelector(".dialogo-whatsapp");
		var $balao = document.createElement("div");
		var $balaoCentro = document.createElement("div");

		$balao.classList.add("balao-d");
		$balaoCentro.classList.add("balao-center");
		// console.log(ele);
		$balao.append(ele);
		$dialogo.appendChild($balao);
		$dialogo.appendChild($balaoCentro);
		frame ++;
		if(frame + 1 <= estrutura.whatsapp.length ) {
			telaWhatsapp();
		} else {
			setTimeout(function() {

				var ElementWhatsapp = conteudo.querySelector(".janela-whatsapp");
				ElementWhatsapp.classList.add("d-none");
				// var video = conteudo.querySelector("#video");
				// video.classList.remove("d-none");
				playSkype();
				
				
			}, 2000)
			
		}
		
	}
	
	function playSkype() {

		var $videoSkype = conteudo.querySelector("#videoSkype");
		var $video = $videoSkype.querySelector(".video");
		
		$videoSkype.classList.remove("d-none");
		$video.play();
		
		conteudo.querySelector("#btn_next").classList.remove("d-none");
		conteudo.querySelector("#btn_next").classList.add("skyeButton");

		// cenaAtual = 2;
		conteudo.querySelector("#btn_next").addEventListener("click", function() {
			
			$videoSkype.classList.add("d-none");
			var video = conteudo.querySelector("#video");
			video.classList.remove("d-none");
			// acionaNext(2);
			acionaProximo(2);
			// habilitaAcao();
			// habilitaContinuar(true);
			// console.log(next_f);
			// cenaAtual+1;
			// playVideo(estrutura.cenas[cenaAtual].video)
			conteudo.querySelector("#btn_next").classList.remove("skyeButton");
			
		});

		// $video.addEventListener("click", function() {

		// });
	}

	// Final Gambis
	function habilitaContinuar(next){
		next_f = ~~next;
		conteudo.querySelector("#btn_next").classList.remove("d-none");
		if (~~next > 0){			
			console.log("habilitaContinuar = acionaProximo", ~~next);
			conteudo.querySelector("#btn_next").addEventListener("click", acionaNext);
		}else{
			console.log("habilitaContinuar = habilitaAcao", ~~next);
			conteudo.querySelector("#btn_next").addEventListener("click", habilitaAcao);			
		}		
	}

	function acionaNext(){
		console.log("acionaNext", next_f);
		conteudo.querySelector("#btn_next").removeEventListener("click", acionaNext);
		conteudo.querySelector("#btn_action").classList.remove("d-none");		
		quadro.classList.add("d-none");
		question.classList.add("d-none");
		question.innerHTML = "";

		console.log("AVANCOU");
		
		acionaProximo(next_f);
	}

	function acionaProximo(id){
		conteudo.querySelector("#btn_next").classList.add("d-none");
		conteudo.querySelector("#btn_next").removeEventListener("click", habilitaAcao);
		habilitaConsole ? console.log("acionaProximo - id: ", id, "cenaAtual: "+(cenaAtual+1), estrutura.cenas[cenaAtual].nome, estrutura.cenas[cenaAtual].descricao) : "";

		if (id != "false"){		
			cenaAtual = ~~id - 1;
		}
		video.dataset.proximo = null;

		console.log(estrutura.cenas[cenaAtual].video);
		playVideo(estrutura.cenas[cenaAtual].video);			
		
	}

	function habilitaIcone(_bl){
		if (_bl){
			conteudo.querySelector("#timer").classList.remove("d-none");
		}else{			
			conteudo.querySelector("#timer").classList.add("d-none");
		}
	}

	function habilitaAcao(){
		console.log("Habilita Ação");

		interval = setInterval(()=>{
			clearInterval(interval);
	        habilitaIcone(true);
	    },20000);		
		
		conteudo.querySelector("#btn_next").classList.add("d-none");
		conteudo.querySelector("#btn_action").classList.add("d-none");
		conteudo.querySelector("#btn_next").removeEventListener("click", habilitaAcao);
		quadro.classList.remove("d-none");
    	quadro.classList.add("question");

		
		question.innerHTML = "<div id='timer' class='d-none'><img src='imagens/pensamento.png'/> <p>Vamos lá? Qual é a melhor opção?</p></div><div id='enunciado'>"+estrutura.cenas[cenaAtual].pergunta+"</div><div id='opcoes' class='flex-ctr'></div><div id='btn_rever'></div>";
		question.querySelector("#btn_rever").addEventListener("click", reverVideo);		

		for (var i = 0; i < estrutura.cenas[cenaAtual].alternativas.length; i ++){		
			var div = document.createElement("div");
			div.id = "opcao"+(i + 1);
			div.dataset.correto = estrutura.cenas[cenaAtual].alternativas[i].correto;
			div.dataset.proximo = estrutura.cenas[cenaAtual].alternativas[i].proximo;			
			div.dataset.video = estrutura.cenas[cenaAtual].alternativas[i].video;			
			div.dataset.id = i + 1;							
			div.addEventListener("click", acionaOpcao)			
			div.innerHTML = "<p>"+estrutura.cenas[cenaAtual].alternativas[i].texto+"</p>";				
			div.classList.add(estrutura.cenas[cenaAtual].alternativas[i].type == "" ? "normal" : estrutura.cenas[cenaAtual].alternativas[i].type);
			question.querySelector("#opcoes").appendChild(div);	
		}

		question.classList.remove("d-none");			
	}

	function acionaOpcao(e){		
		conteudo.querySelector("#btn_action").classList.remove("d-none");		
		quadro.classList.add("d-none");
		question.classList.add("d-none");
		question.innerHTML = "";

		console.log(e.currentTarget.dataset.correto);

		video.dataset.proximo = e.currentTarget.dataset.proximo;
		playVideo(e.currentTarget.dataset.video);		

		if (e.currentTarget.dataset.correto === "true"){			
			pontuacao[cenaAtual] = ~~pontuacao[cenaAtual] + 1;
			tentativa_atual = 0;			
		}else{
			tentativa_atual ++;
			pontuacao[cenaAtual] = ~~pontuacao[cenaAtual] - 1;			
		}

		if (tentativa_atual > ~~estrutura.tentativas){
			//window.open("https://lh3.googleusercontent.com/-wj3lT-WBmoM/VamwgXVJj-I/AAAAAAAAmi4/ZIA-nPIpLOY/w346-h279/79rc0.gif","_blank");
		}
	}		
	
	function fimVideo(){		
		gravaDados();
		
		if (cenaAtual == totalCenas-1 && lessonStatus !== "completed") {
			habilitaConsole ? console.log("completed") : "";
			lessonStatus = "completed";

			setLMSValue("cmi.core.lesson_status", lessonStatus, true);			
		}
	}

	function gravaDados() {
		var totalPontos = 0;
		for (var i = 0; i < pontuacao.length; i++){			
			pontuacao[i] != undefined && pontuacao[i] != "" ? totalPontos = ~~totalPontos + ~~pontuacao[i] : "";			
		}
		
		var pontos = ~~(~~totalPontos*100/~~estrutura.maxPontos);		
		
		lessonLocation = estrutura.cenas[cenaAtual].id+";"+pontuacao.toString()+";"+pontos;		
		
		setLMSValue("cmi.core.lesson_location", lessonLocation, true);	
		setLMSValue("cmi.core.score.raw", (pontos < 0 ? 0 : pontos), true);
	}

}