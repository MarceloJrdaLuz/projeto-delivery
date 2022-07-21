# Projeto backend!

## 💻 Pré-requisitos

1. Antes de começar você precisa ter uma conta no Mongodb, e criar um cluster para ser usado por essa aplicação.
2. Para usar o recurso do `Esqueci minha senha` você precisará ter um e-mail outlook configurado para ser usado como transporter do token de redefinição da senha. Então na chave `NODEMAILER_HOST` pode ser usado o host `smtp-mail.outlook.com`, e a chave `NODEMAILER_PORT` usando a porta `587`.  Ou terá que adaptar outro transporter. 
3. Você também precisa criar um hash que vai ser usado na aplicação para geração de Tokens únicos e coloca-lo na chave `AUTH_SECRET`
4. No momento essa aplicação foi desenvolvida usando uma api de pagamento do PagSeguro. Ai você tem que criar uma conta no pagseguro, e usar a sandbox de testes deles. E gerar o token da sua conta e colocá-la na `API_TOKEN` do arquivo `.env`. 
5. Na chave `WHATS_NUMBER` colocar um whats para teste de envio de pedidos. 

## 🚀 Rodando projeto local

Para rodar o backend, siga estas etapas:

1. Na raiz do projeto do back, duplique o arquivo `.env.exemple` e renomeie essa cópia para `.env`.
2. Dentro do arquivo `.env` tem a `MONDOBD_URI` para a sua base de dados, configure de acordo com a sua base.
3. Instale as dependências rodando `npm i`.
4. Suba a aplicação rodando `npm start`. O serviço vai rodar em `http://localhost:5000/`. Agora você já pode usar a aplicação frontend pra interagir.