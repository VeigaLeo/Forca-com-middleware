# Forca com middleware
 Jogo similar ao Roda Roda Jequiti implementando práticas de middleware. Vários usuários podem jogar em tempo real. O projeto conta com sistema de pontuação lógica, registro de usuário, onde caso o usuário se desconecte e volte ao jogo, sua pontuação será mantida. Jogo em formato "infinito", caso as palavras forem adivinhadas, o servidor escolherá outras palavras para os jogadores.

# Instalação
* Clone o projeto em sua máquina;
* execute `npm install` para instalar todas as dependências;
* execute `node server.js` para rodar o servidor em sua versão final;
* execute `npm start` para rodar o projeto client em sua versão final;


# Sistema
Após executar todos os comandos acima. 
Aparecerá a seguinte tela: 
![alt text](https://github.com/VeigaLeo/Forca-com-middleware/blob/master/img/screen1.png)

Nessa tela, é onde ocorre o registro do jogador, onde o usuário pode colocar seu nome como identificador

Após inserir o nome, o sistema irá registrar esse jogador e então permitir que se junte aos outros jogadores:
![alt text](https://github.com/VeigaLeo/Forca-com-middleware/blob/master/img/screen2.png)

E então o jogador poderá escolher uma respectiva letra para adivinhar.

# Estrutura
O projeto possui quatro etapas, onde em cada etapa foram sendo implementados novas capacidades e funcionalidades relacionadas à sistemas distribuidos.
  ## Etapa 1
   Jogo da forca similiar ao roda roda jequti, totalmente local, em um único processo.
   Para executar esta etapa do projeto, execute `git checkout v1.0` em seu terminal, `npm install` para instalar as dependências e em seguida, execute `npm start` para rodar o client do jogo.
  ## Etapa 2
   Adição do `Socket.io` para o multiprocessamento, versão do jogo onde é possível dois clientes se comunicar com o servidor.
   Para executar esta etapa do projeto será necessário rodar o servidor junto com a aplicação client. Então `git checkout v2.0`, em seguida `npm install` para instalar as dependências. Na pasta root do projeto, execute `node main.js`. Após isso abra outra aba do terminal e execute `npm start`.
  ## Etapa 3
  Versão do jogo baseado em RPC, em tempo real, ainda utilizando `Socket.io`, jogadores pontuam, o jogo ainda não é "infinito".
  Para executar esta etapa do projeto execute `git checkout v3.0`, `npm install` para instalar as dependências e o servidor `node server.js` na pasta root do projeto e por fim `npm start`.
  ## Etapa 4 (Final)
  Versão do jogo em tempo real, capaz de suportar quantos jogadores quiser. Jogo infinito, onde cada vez que as três palavras são reveladas, o jogo sorteia novas três palavras, mas os jogadores continuam pontuando de onde estavam. Caso um jogador deseja se desconectar ele será removido da fila, e caso ele quiser voltar, a sua quantidade de pontos deverá voltar ao que era antes.
  Para executar esta etapa do projeto execute `git checkout v4.0`, `npm install` para instalar as dependências e o servidor `node server.js` na pasta root do projeto e por fim `npm start`.
  
# Tecnologias
- NodeJs
- IDE: Visual Studio Code
- Electron
- Socket.io
