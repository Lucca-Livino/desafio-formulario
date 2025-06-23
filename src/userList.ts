import './style/userList.css';

const listabody = document.querySelector('#lista-body')!;

window.addEventListener('load', async () => {
  try {
    const result = await fetch('http://localhost:3000/usuarios', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await result.json();
    console.log(data);
    try {
      data.forEach((user: any) => {
        listabody.insertAdjacentHTML('beforeend', `
          <li class="usuario-item">
            <strong>ID:</strong> ${user.id}<br>
            <strong>Nome:</strong> ${user.nome}<br>
            <strong>E-mail:</strong> ${user.email}<br>
            <strong>Sexo:</strong> ${user.sexo}<br>
            <strong>Curso:</strong> ${user.curso}<br>
            <strong>Observação:</strong> ${user.descricao}
          </li>`);
      });
    } catch (error) {
      console.error('Erro ao processar os dados do GET:', error);
      alert('Erro ao processar os dados recebidos. Por favor, tente novamente mais tarde.');
    }
  } catch (error) {
    console.error('GET error:', error);
    alert('Erro ao fazer GET. Por favor, tente novamente mais tarde.');
  }
});
