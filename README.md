# Modelo personalizavel para presente digital

Esse projeto foi montado para servir como base comercial e, ao mesmo tempo, ja deixar um exemplo para o casal do seu amigo.

## Como personalizar

1. Coloque as fotos e o MP3 na pasta `assets/`.
2. Edite o arquivo `config.js`.
3. Abra `index.html` no navegador ou publique em hospedagem estatica.

## O que voce troca no `config.js`

- `intro`: textos da tela de abertura
- `hero`: titulo principal e bloco de destaque
- `relationship.names`: nome do casal
- `relationship.startDate`: data usada no contador
- `relationship.displayDateLabel`: data escrita do jeito que voce quer mostrar
- `media.heroPhoto`, `secondaryPhoto`, `profilePhoto`, `galleryImages`: caminhos das fotos
- `audio.file`: caminho do MP3
- `audio.title` e `audio.artist`: nome da musica
- `message.body`: mensagem final
- `theme`: cores do modelo

## Exemplo de audio

Se o arquivo estiver em `assets/musica-casal.mp3`, use:

```js
audio: {
  file: "assets/musica-casal.mp3"
}
```

## Para comercializar

1. Duplique a pasta do projeto para cada pedido.
2. Troque `config.js` e os arquivos de `assets`.
3. Publique e entregue o link para o cliente.

Se `audio.file` ficar vazio, o site continua funcionando e mostra um aviso para adicionar a musica depois.
