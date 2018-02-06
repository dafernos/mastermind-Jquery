{
	let colores=["black","white","blue","red","yellow","green","purple","brown"];
	let numBolas = 4;
	var mastermind=(function(){
		let combinacion=[];
		let negras,blancas;
		let posicionbn=[];

		let init = function(){
			generaCombinacion();
			mostrar();
		};
		//muestra la combinación objetivo por consola.
		let mostrar=function(){
			console.log(combinacion);		
		};
		//genera una combinación de negros (número de bolas que están en su sitio) y blancos (número de bolas que estám, pero no en su sitio).
		let comprobarIntento=function(intento){
			let salir;
			posicionbn.length=0;
			let copiacombinacion=combinacion.slice();
			//negros(en su sitio)
			negras=0; 
			for (let i = 0; i <= intento.length-1; i++) {
				if(intento[i]===copiacombinacion[i]){
					negras++; 
					copiacombinacion[i]=undefined;
					intento[i]=null;
					posicionbn[i]="n";
				}
			}
			//blancos(estan en otra posicion)
			blancas=0;
			for(let i=0; i <= intento.length-1;i++){
				salir = false;
				for (let  j= 0; j <= copiacombinacion.length-1; j++) {
					if(copiacombinacion[j]===intento[i] && salir===false){
						blancas++;
						copiacombinacion[j]=undefined;
						
						posicionbn[j]="b";
						salir=true;
					}
				}
			}
			return {
				negras: negras,
				blancas: blancas,
				copiacombinacion:copiacombinacion,
			}
		};
		//genera una combinación.
		let generaCombinacion = function(){
			negras=0;
			blancas=0;
			if(combinacion) combinacion=[];
			for (let i = 0; i < numBolas; i++) {
				combinacion.push(colores[parseInt(Math.random()*8)]);
			}
		}
		return {
			init:init,
			comprobarIntento:comprobarIntento,
			mostrar:mostrar,
		}
	})();
	
	//INTERFAZ GRAFICA
	let init=function(){
		mastermind.init();
		comportamiento.crearFila();
		$(document.forms[0].elements[0]).off('click',init);
	}
	//reiniciar Juego
	let reiniciar= function(){
		$(document.forms[0].elements[0]).on('click',init);
		$('#filas').html("");
		$('#ganado').css('display','none');
		init();
	}
	//Poner colores a las bolas que se selecionan para insertarse
	$(document).ready(function(){
		i=0;
		
		//rellenar bolas lateral
		$('.color').each(function () {
			
			$(this).css('background',colores[i]);
			$(this).on('click',comportamiento.ponerBola);
			i++;
		});
		//Iniciar Juego
		
		//llamadas
		$(document.forms[0].elements[0]).on('click',init);
		$(document.forms[0].elements[1]).on('click',reiniciar);
		$('#fin').on('click',reiniciar);
		$('#comprobar').on('click',comportamiento.comprobarFila);

	});
	var comportamiento = (function() {
		//fila a insertar
		let $fila;
		//numero de bola puesta en la fila
		let conBola=0;
		//numero de fila
		let conFila=0;
		let $colorSeleccionado;
		let $bolAcierto;
		
		let crearFila =function () {
			//cogemos las bolas de la fila
			let $filaNueva = $(document.createElement('div'))
				.addClass('fila'+conFila);
			let $bolasVacias = $(document.createElement('div'))
				.addClass('wrapper linea');
			let $aciertosVacios = $(document.createElement('div'))
				.addClass(' wrapper cuatro');
			//creamos las bolas para colocar y los aciertos
			for (let i = 0; i < numBolas; i++) {
				$bolasVacias.append($(document.createElement("div"))
					.addClass('circle bola'+conFila));
				$aciertosVacios.append($(document.createElement("div"))
					.addClass('circle acierto'+conFila));
			}
			$filaNueva.append($bolasVacias);
			$filaNueva.append($aciertosVacios);
			$('#filas').append($filaNueva);
			$fila= $('.bola'+conFila);
			conFila++;
		}
		//Quitar bola de la fila
		
		let quitarBola =function () {
			$(this).css('backgroundColor','rgb(211, 211, 211)');
			$(this).off("click", quitarBola);
			conBola--;
		}
		//Poner bola en la fila
		let ponerBola=function (event) {
			colorSeleccionado = $(this).css('backgroundColor');
			$fila.each(function(){
				if ($(this).css('backgroundColor') === 'rgb(211, 211, 211)'){
					$(this).css('background',colorSeleccionado);
					$(this).on("click", quitarBola);
					conBola++;
					return false;
				}
			});
		}
		let comprobarFila=function () {
			let combinacion=[];
			$bolAcierto = $('.acierto'+(conFila-1));
			let aciertos;
			let cambioColores={
				"rgb(0, 0, 0)":'black',
				"rgb(255, 255, 255)":'white',
				"rgb(0, 0, 255)":'blue',
				"rgb(255, 0, 0)":'red',
				"rgb(255, 255, 0)":'yellow',
				"rgb(0, 128, 0)":'green' ,
				"rgb(128, 0, 128)":'purple',
				"rgb(165, 42, 42)":'brown',			
			};
			$fila.each(function(index, el) {
				$backcolor=$(this);
				$(cambioColores).each(function(index, el) {
					combinacion.push(this[$backcolor.css('backgroundColor')]);
				});
			});
			console.log(combinacion);
			/*
			for (let i = 0; i <= fila.length - 1; i++) {
				combinacion.push(fila[i].style.backgroundColor);
			}
			 */
			if (conBola ==4) {
				aciertos = mastermind.comprobarIntento(combinacion);
				//Poner aciertos (bolas negras)
				if (aciertos.negras > 0 ){
					console.log(aciertos.negras);
					for (let i = 0; i < aciertos.negras; i++) {
						$bolAcierto[i].style.background = "black";
					};
				};
				//Poner aciertos (bolas blancas)
				if (aciertos.blancas > 0){
					console.log(aciertos.blancas);
					for (let i = 0; i < aciertos.blancas; i++) {
						sumBlanc=aciertos.negras+i;
						$bolAcierto[sumBlanc].setAttribute('style','background: white');
					};
				}; 
				//si hay 4 aciertos o llega a 7 intentos se finaliza el juego
				if(aciertos.negras === numBolas || conFila===7){
					$('#ganado').css('display','block');
					let adivinar = $('#conad');
					if (conFila===7) {
						$bola =$('.boladi');
						for (let i = 0; i < numBolas; i++) {
							$bola[i].css('background:'+aciertos.copiacombinacion[i]);
						}
						$('#finTexto').html('<h1>Has Perdido</h1>');
					}else{
						$('#finTexto').html('<h1>Has Ganado</h1>');
					}
					$adivinar.css('display','block');
					quitarEvento();
				}else{
					quitarEvento();
					crearFila();
				}
			}
			conBola=0;
		}
		let quitarEvento = function(){
			$fila.each(function() {
				 $(this).off('click',quitarBola);
			});
		}
		return{
			crearFila:crearFila,
			quitarBola:quitarBola,
			ponerBola:ponerBola,
			comprobarFila:comprobarFila,
		}
	})();	
}