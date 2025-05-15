// Script para player de música customizado + elogios animados + modal de imagens

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const botaoAudio = document.getElementById('audioToggle');

    // Tentativa de autoplay quando o site carregar
    const playAudio = () => {
        audio.volume = 0.6;
        audio.play().catch(() => {
            // Se o navegador bloquear o autoplay, espera interação do usuário
        });
    };

    // Tentar autoplay após um pequeno delay
    setTimeout(playAudio, 500);

    // Garante autoplay em dispositivos móveis após primeira interação
    document.body.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                if (botaoAudio && audio && audio.paused === false) {
                    const icon = botaoAudio.querySelector('img');
                    if (icon) icon.src = './assets/img/pause.png';
                }
            }).catch(() => {});
        }
    }, { once: true });

    if (botaoAudio) {
        const iconAudio = document.createElement('img');
        iconAudio.src = './assets/img/play.png';
        iconAudio.alt = 'Tocar';
        iconAudio.width = 40;
        botaoAudio.textContent = '';
        botaoAudio.appendChild(iconAudio);

        botaoAudio.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                iconAudio.src = './assets/img/pause.png';
            } else {
                audio.pause();
                iconAudio.src = './assets/img/play.png';
            }
        });
    }

    const fotos = document.querySelectorAll('.grid-fotos img');
    fotos.forEach((img, index) => {
        img.setAttribute('loading', 'lazy');
        img.style.opacity = 0;
        img.style.transform = 'translateY(20px)';
        setTimeout(() => {
            img.style.transition = 'all 0.6s ease';
            img.style.opacity = 1;
            img.style.transform = 'translateY(0)';
        }, 200 * index);
    });

    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = '<img id="modalImg" style="max-width: 90%; max-height: 90%; border-radius: 10px;"><span style="position: absolute; top: 20px; right: 30px; font-size: 2rem; color: white; cursor: pointer;" id="closeModal">&times;</span>';
    document.body.appendChild(modal);

    fotos.forEach(img => {
        img.addEventListener('click', () => openModal(img.src));
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    function openModal(src) {
        document.getElementById('modalImg').src = src;
        modal.style.display = 'flex';
    }

    const botao = document.getElementById('botaoElogio');
    const mensagem = document.getElementById('mensagemElogio');

    if (botao && mensagem) {
        botao.textContent = '🎁';

        fetch('./assets/elogios.txt')
            .then(res => res.text())
            .then(data => {
                const elogios = data.split('\n').filter(Boolean);

                botao.addEventListener('click', () => {
                    const texto = elogios[Math.floor(Math.random() * elogios.length)];
                    mensagem.textContent = texto;
                    mensagem.classList.add('show');
                    botao.classList.add('animar');
                    setTimeout(() => botao.classList.remove('animar'), 500);
                    setTimeout(() => mensagem.classList.remove('show'), 3000);

                    for (let i = 0; i < 20; i++) {
                        const particle = document.createElement('span');
                        particle.textContent = '✨';
                        particle.classList.add('foguinho');

                        const angle = Math.random() * 2 * Math.PI;
                        const radius = Math.random() * 120 + 40;

                        particle.style.left = `${botao.getBoundingClientRect().left + botao.offsetWidth / 2}px`;
                        particle.style.top = `${botao.getBoundingClientRect().top + window.scrollY + botao.offsetHeight / 2}px`;
                        particle.style.position = 'absolute';
                        particle.style.fontSize = `${Math.random() * 12 + 14}px`;
                        particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

                        document.body.appendChild(particle);
                        requestAnimationFrame(() => {
                            particle.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`;
                            particle.style.opacity = 0;
                        });

                        setTimeout(() => particle.remove(), 700);
                    }
                });
            });
    }
});
