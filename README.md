# Barbeasy

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

- [ ] **Dashboard:** Tenha uma visão geral do desenpenho da sua barbearia, por meio de uma Dashboard detalhada com os dados de agendamentos realizados

## Como Começar?
Tanto para os clientes das barbearias quando para as proprias barbearias, basta acessar o site da platafoma [Barbeasy](https://www.barbeasy.com.br) e realize seu cadastro!

### Vamos criar uma experiência excepcional para seus clientes e otimizar a administração de sua barbearia com o Barbeasy!

---
# Especificações Técnicas e Implementação
Nesta sessão, iremos dar algumas especificações técnicas sobre o sistema e o passo a passo de como implementá-lo em seu ambiente de desenvolvimento.  
  
## Especificações Técnicas
O sistema Barbeasy é um sistema distribuído, composto por três APIs, sendo duas do Google e uma do MercadoPago.

### Tecnologias usadas:
- Front-End: React, HTML5 e CSS.
- Back-End: JavaScript e Node.js.
- Banco de Dados: MySQL e Xampp como servidor de Banco de Dados.

### APIs usadas
- Distance Matrix - Google.
- Gateway de Pagamento do Mercado Pago.
# Obs: Para que a API do Google e do Mercado Pago funcionem, é preciso das credências de acesso. Você pode obter suas credências de acesso do google criando uma conta de desenvolvedor em: (https://developers.google.com/) e a do Mercado Pago em: (https://www.mercadopago.com.br/developers/pt). Além disso, lembre-se de cadastrar a latitude e longitude da barbearia no BD para que a API do google não retorne null.

### Modelo Entidade-Relacionamento
![MER](https://github.com/jpdicarvalho/WebProject-Barbeasy/assets/114435447/651bd3ee-3ae8-469d-b9be-d827b38fa737)

### Diagrama de Componentes
![DC](https://github.com/jpdicarvalho/WebProject-Barbeasy/assets/114435447/fa0841d1-2818-46c5-be95-3e3b238d1da9)
