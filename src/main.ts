import './style/style.css'
import { z } from 'zod'

const nome = document.querySelector<HTMLInputElement>('#nome')!
const email = document.querySelector<HTMLInputElement>('#email')!
const sexoMasculino = document.querySelector<HTMLInputElement>('#sexo_masculino')!
const sexoFeminino = document.querySelector<HTMLInputElement>('#sexo_feminino')!
const curso = document.querySelector<HTMLSelectElement>('#cursos')!
const descricao = document.querySelector<HTMLTextAreaElement>('#observacoes')!
const termos = document.querySelector<HTMLInputElement>('#termos')!
const enviar = document.querySelector<HTMLInputElement>('input[type="submit"]')!

const themeSwitch = document.getElementById('theme-switch')!
let darkmode = localStorage.getItem('darkmode');

const enableDarkMode = () => {
    document.body.classList.add('dark-mode')
    localStorage.setItem('darkmode', 'active');
}

const disableDarkMode = () => {
    document.body.classList.remove('dark-mode')
    localStorage.removeItem('darkmode');
}

if (darkmode === "active") {
    enableDarkMode();
}

themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== "active" ? enableDarkMode() : disableDarkMode();

})

export interface Usuario {
    id?: string,
    nome: string,
    email: string,
    sexo: string,
    curso: string,
    descricao?: string,
    termo: boolean
}

const usuarioSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    sexo: z.enum(['masculino', 'feminino'], { required_error: 'Sexo é obrigatório' }),
    curso: z.string().min(1, 'Curso é obrigatório'),
    descricao: z.string().optional(),
    termo: z.literal(true, { errorMap: () => ({ message: 'Você deve aceitar os termos' }) })
})

function mostrarErro(input: HTMLElement | null, message: string) {
    if (!input) return;
    const erro = document.createElement('div');
    erro.className = 'erro-validacao';
    erro.style.color = 'red';
    erro.textContent = message;
    input.parentElement?.appendChild(erro);
}

function limparForm(campos: any) {
    campos.nome.value = '';
    campos.email.value = '';
    campos.sexoMasculino.checked = false;
    campos.sexoFeminino.checked = false;
    campos.curso.selectedIndex = 0;
    campos.descricao.value = '';
    campos.termos.checked = false;
}

enviar.addEventListener('click', async (event) => {
    event.preventDefault()
    document.querySelectorAll('.erro-validacao').forEach(e => e.remove());

    let sexo = ''
    if (sexoMasculino.checked) {
        sexo = 'masculino'
    } else if (sexoFeminino.checked) {
        sexo = 'feminino'
    }

    const cursoSelecionado = curso.options[curso.selectedIndex].text;

    const usuario = {
        nome: nome.value,
        email: email.value,
        sexo: sexo,
        curso: cursoSelecionado,
        descricao: descricao.value,
        termo: termos.checked
    }

    const validacao = usuarioSchema.safeParse(usuario)
    if (!validacao.success) {
        validacao.error.errors.forEach(erro => {
            let input: HTMLElement | null = null;
            switch (erro.path[0]) {
                case 'nome': input = nome; break;
                case 'email': input = email; break;
                case 'sexo': input = sexoMasculino.parentElement; break;
                case 'curso': input = curso; break;
                case 'termo': input = termos; break;
            }
            mostrarErro(input, erro.message);
        });
        return;
    }


    try {
        await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        })
        limparForm({ nome, email, sexoMasculino, sexoFeminino, curso, descricao, termos })
        alert('Inscrição realizada com sucesso!')
    } catch (err) {
        alert('Erro ao salvar inscrição!')
    }
})