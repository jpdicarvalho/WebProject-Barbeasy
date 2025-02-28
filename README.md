# Primeiro esboço do Barbeasy na versão web

Bem-vindo ao Barbeasy, um sistema eficiente e fácil de usar para agendamento de serviços e processamento de pagamentos em barbearias. Esta aplicação foi desenvolvida para simplificar a gestão de agendamentos e transações financeiras, proporcionando uma experiência fluida tanto para os clientes quanto para os profissionais da barbearia.

## Recursos Principais para os Clientes das barbearias
- [x] **Busca fácil por barbearias:** Encontre barbearias próximas a você, baseado em sua localização. Além disso, é possível buscar por barbearias abertas ou fechadas, por qualquer nome de barbearia em específico e por nota de avalição.

- [x] **Agendamento Simples:** Realize agendamentos de serviços, diretamente do conforto de seus dispositivos, escolhendo horários convenientes.

- [x] **Processamento de Pagamentos Seguro:** Faça pagamentos diretamente para a barbearia escolhida, garantindo assim, seu serviço agendado.

## Recursos Principais para Barbearias

- [x] **Processamento de Pagamentos Seguro:** Receba o valor do serviço agendado pelo seu cliente, no ato do agendamento.

- [ ] **Painel de controle:** Use o painel de controle para definir e personalizar os recursos oferecidos pelo seu negócio, como:
  - [ ] Definição e Gestão de Horários;
  - [ ] Defição e Gestão de Serviços; e
  - [ ] Definição e Gestão de Profissionais.

## Como Começar?
Tanto para os clientes das barbearias quando para as proprias barbearias, basta acessar o site da platafoma [Barbeasy](https://www.barbeasy.com.br) e realize seu cadastro!

### Vamos criar uma experiência excepcional para seus clientes e otimizar a administração de sua barbearia com o Barbeasy!

---
# Especificações Técnicas e Implementação
Nesta sessão, iremos dar algumas especificações técnicas sobre o sistema e o passo a passo de como implementá-lo em seu ambiente de desenvolvimento.  
  
## Especificações Técnicas
O sistema Barbeasy é um sistema distribuído, composto por três APIs, sendo duas do Google e uma do MercadoPago.

### Tecnologias usadas:
- Front-End: React, Vite, HTML5 e CSS.
- Back-End: JavaScript e Node.js.
- Banco de Dados: MySQL e Xampp como servidor de Banco de Dados.

### APIs integradas
- Gateway de Pagamento do Mercado Pago.

## Modelo Entidade-Relacionamento
![MER](https://github.com/jpdicarvalho/WebProject-Barbeasy/assets/114435447/d6812ca4-4e72-45bd-ac9d-ca5704f3536a)



## Diagrama de Componentes
![Diagrama de Componentes drawio](https://github.com/jpdicarvalho/WebProject-Barbeasy/assets/114435447/0d78cbf4-b9ac-4cf9-8de8-08981803d298)


---
# Implementação
Siga o passo a passo abaixo para realizar a implementaçao do sistema em seu ambiente de desenvolvimento:
- Banco de Dados:
  - importe o arquivo barbeasy_two.sql no seu painel do phpMyadmim do xampp; e
  - Crie uma barbearia fictícia na tabela 'barbearias'.
- Back-End: abra o terminal 'prompt de comando' no VSCode, entre na pasta 'back-end' e use o comando `npm install` para baixar os pacotes necessário.
- Front-End: abra o terminal 'prompt de comando' no VSCode, entre na pasta 'frontend' e use o comando `npm install` para baixar os pacotes necessário.

Quando o front-end for iniciado, um link será gerado no terminal, use-o para acessar a aplicação.

# Isso é tudo pessoal!! Thanks!
