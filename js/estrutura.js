var estrutura = 
{
	titulo: "ASSESSORIA DE COMUNICAÇÃO – DEFININDO PÚBLICOS PRIORITÁRIOS",	
	type: "video/mp4",
	maxPontos: 6,
	tentativas: 3,
	whatsapp: 
	[
		{
			id: 1,
			texto: "Bom dia para o meu melhor assessor de comunicação!",
			opcoes: 
			[
				
				"Bom dia, Nicole!",
				"Bom dia para minha melhor head de comunicação!!!"
				
			]
		},
		{
			id: 2,
			texto: "Estamos precisando de sua ajuda. Podemos fazer uma videoconferência agora?",
			opcoes: 
			[
				"Sim, está tranquilo agora. Pode me chamar.",
				"Claro! Nossas conversar sempre geram ótimos resultados!"
			]
		}
	],
	cenas: 	
	[
		{
			nome: "Cena 1",
			descricao: "",
			pergunta: "<h2>Quem deve ser o primeiro grupo a ser informado sobre essa novidade da empresa?</h2>",
			id: 1,
			video: "videos/cena1.mp4",			
			alternativas:
			[			
				{
					texto: "A imprensa especializada em moda.",
					video: "videos/cena1_r2.mp4", 
					correto: false, 
					proximo: false, 
					type: ""
				},
				{
					texto: "Os funcionários da empresa.",
					video: "videos/cena1_r1.mp4", 
					correto: true,
					proximo: 2, 
					type: ""
				}
			]			
		},

		{
			nome: "Cena 2",
			descricao: "",
			pergunta: "<h2>Agora que decidimos que o público interno será o primeiro a ser informado, precisamos organizar como faremos o comunicado externo, qual a melhor decisão?</h2>",
			id: 2,
			video: "videos/cena4.mp4",			
			alternativas:
			[			
				{texto: "Informar todos os demais segmentos do público externo simultaneamente e com instrumentos diferentes.", video: "videos/cena2_r1.mp4", correto: true, proximo: 3, type: "watsapp"},
				{texto: "É importante ter uma ordem hierárquica rígida para essa divulgação, sendo: primeiro a imprensa; depois, as confecções; em terceiro, os lojistas; na sequência, influencers e outros multiplicadores; e, por fim, os consumidores.", video: "videos/cena2_r2.mp4", correto: false, proximo: false, type: "watsapp"}
			]
		},

		{
			nome: "Cena 3",
			descricao: "",
			pergunta: "<h2>Qual poderia ser o melhor brinde para marcar e representar esse momento de mudança?</h2>",
			id: 3,
			video: "videos/cena3.mp4",			
			alternativas:
			[			
				{texto: "Um cachepô e uma caneca em fibra de coco, com algumas decorações feitas em aplicação do novo jeans.", video: "videos/cena3_r1.mp4", correto: true, proximo: 4, type: ""},
				{texto: "Uma necessaire feita com o novo jeans, forrada com material plástico que a torna mais resistente e duradouro.", video: "videos/cena3_r2.mp4", correto: false, proximo: false, type: ""}
			]
		},

		{
			nome: "Cena 4",
			descricao: "",
			pergunta: "<h2>O brinde deve conter características que marcam essa nova etapa da empresa. Quais características são essenciais nesse brinde?</h2>",
			id: 4,
			video: "videos/cena4.mp4",			
			alternativas:
			[			
				{texto: "Material sintético, para evitar destruir a natureza, principalmente à base de polipropileno, que utiliza processos laboratoriais, além do próprio jeans.", video: "videos/cena4_r1.mp4", correto: false, proximo: false, type: ""},
				{texto: "Material natural, que pudesse ser reaproveitado pela natureza ao ser descartado, como o coco, aliado a amostras do novo tecido para divulgá-lo.", video: "videos/cena4_r2.mp4", correto: true, proximo: 5, type: ""}
			]			
		},		

		{
			nome: "Final",
			descricao: "",
			pergunta: "",
			id: 5,
			video: "videos/cena6.mp4",			
			alternativas:
			[]
		}

	]
}