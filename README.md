# Basic_SistemaAgenciaViagem
# 🌍 Agência de Viagens - Back-end Java Spring Boot

Bem-vindo ao repositório do **sistema Básico de Agência de Viagens**, desenvolvido em Java com Spring Boot, seguindo padrões arquiteturais modernos e práticas recomendadas para escalabilidade, manutenção e integração contínua.

## 🧭 Visão Geral

Esta aplicação oferece um backend robusto e orientado a microserviços para uma agência de viagens fictícia. O sistema cobre funcionalidades essenciais como:

- Cadastro e gerenciamento de **clientes**
- Criação e exibição de **pacotes de viagem**
- Realização e cancelamento de **reservas**
- Processamento de **pagamentos** com diferentes métodos
- Camadas bem definidas: `Controller`, `Service`, `Repository`, aplicando padrões como **MVC**, **Command**, **Builder**, **Singleton** e **Factory**

## 🛠️ Tecnologias e Padrões Utilizados

- **Java 21**
- **Spring Boot**
- **Maven** como gerenciador de dependências
- **MySQL** como banco de dados relacional
- **JPA/Hibernate** para persistência de dados
- **RESTful APIs**
- **Design Patterns**:
  - `Factory` para meios de pagamento
  - `Builder` para construção de pacotes de viagem
  - `Command` para controle de ações de reserva
- Integração com **HTML, CSS e JS puros** no front-end (templates em `/resources/templates`)

## 📁 Estrutura do Projeto
├── src │ ├── main │ │ ├── java/com/example/back_agencia_viagem │ │ │ ├── controller │ │ │ ├── model │ │ │ ├── repository │ │ │ ├── service │ │ │ └── configuration │ │ └── resources │ │ ├── templates │ │ └── application.properties │ └── test ├── pom.xml └── README.md


## 🚀 Como Executar o Projeto

### Pré-requisitos

- Java 21+
- Maven 3.8+
- MySQL (com banco criado previamente)

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/back-agencia-viagem.git
   cd back-agencia-viagem

###  Configure o banco de dados em src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/agencia_viagem
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update

### Acesse a API
Aplicação: http://localhost:8080
Interface HTML: embutida em /templates

### Boas Práticas Adotadas
Separação de responsabilidades (SRP)

Estruturação MVC

Injeção de dependência com Spring

Padrões de projeto para extensibilidade

Versionamento de código com .gitignore e .gitattributes configurados

Arquitetura orientada a serviços (SOA-ready)

Configuração pronta para pipelines CI/CD (Jenkins, GitHub Actions)
