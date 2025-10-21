/**
 * Serviço de Moderação de Conteúdo
 * 
 * Este serviço integra com a API de moderação da OpenAI para verificar
 * conteúdo impróprio antes de permitir o envio de perguntas e respostas.
 */

// TODO: Implementar integração com OpenAI quando a API key estiver disponível
// import { OpenAI } from 'openai';

/**
 * Tradução das categorias de moderação para português
 */
const CATEGORIAS_TRADUCAO = {
    'hate': 'discurso de ódio',
    'hate/threatening': 'ameaças de ódio',
    'harassment': 'assédio',
    'harassment/threatening': 'assédio com ameaças',
    'self-harm': 'autolesão',
    'self-harm/intent': 'intenção de autolesão',
    'self-harm/instructions': 'instruções de autolesão',
    'sexual': 'conteúdo sexual',
    'sexual/minors': 'conteúdo sexual envolvendo menores',
    'violence': 'violência',
    'violence/graphic': 'violência gráfica',
    'illicit': 'conteúdo ilícito',
    'illicit/violent': 'conteúdo ilícito violento'
};

/**
 * Verifica se o conteúdo contém linguagem imprópria
 * 
 * @param {string} texto - Texto a ser verificado
 * @returns {Promise<{aprovado: boolean, categorias?: object, mensagem?: string}>}
 */
export const verificarConteudo = async (texto) => {
    // TODO: Descomentar quando a API key da OpenAI estiver configurada
    /*
    try {
        const client = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true // Nota: Em produção, use backend
        });

        const resposta = await client.moderations.create({
            model: "omni-moderation-latest",
            input: texto
        });

        const resultado = resposta.results[0];

        if (resultado.flagged) {
            // Conteúdo foi sinalizado como impróprio
            const categorias = resultado.categories;
            const categoriasAtivas = Object.keys(categorias)
                .filter(cat => categorias[cat])
                .map(cat => CATEGORIAS_TRADUCAO[cat] || cat);

            return {
                aprovado: false,
                categorias: categorias,
                mensagem: `Seu conteúdo foi bloqueado por conter: ${categoriasAtivas.join(', ')}.`
            };
        }

        return {
            aprovado: true
        };
    } catch (error) {
        console.error('Erro ao verificar moderação:', error);
        
        // Em caso de erro na API, permitir envio mas logar o erro
        return {
            aprovado: true,
            erro: 'Não foi possível verificar o conteúdo. Prosseguindo com o envio.'
        };
    }
    */

    // MOCK: Implementação temporária para desenvolvimento
    // Remove este bloco quando a integração real estiver ativa
    console.log('🔍 MODERAÇÃO (MOCK):', texto);
    
    // Simula verificação de palavras proibidas para testes
    const palavrasProibidas = ['spam', 'golpe', 'hack', 'pornografia'];
    const textoLower = texto.toLowerCase();
    
    const contemPalavraProibida = palavrasProibidas.some(palavra => 
        textoLower.includes(palavra)
    );

    if (contemPalavraProibida) {
        console.warn('⚠️ MODERAÇÃO: Conteúdo bloqueado (mock)');
        return {
            aprovado: false,
            mensagem: 'Seu conteúdo contém linguagem ou termos impróprios e não pode ser publicado.'
        };
    }

    console.log('✅ MODERAÇÃO: Conteúdo aprovado (mock)');
    return {
        aprovado: true
    };
};

/**
 * Verifica múltiplos campos de texto
 * 
 * @param {Object} campos - Objeto com campos a serem verificados {nome: texto}
 * @returns {Promise<{aprovado: boolean, campoRejeitado?: string, mensagem?: string}>}
 */
export const verificarMultiplosCampos = async (campos) => {
    // TODO: Descomentar quando a API estiver configurada
    /*
    for (const [nomeCampo, texto] of Object.entries(campos)) {
        if (texto && texto.trim()) {
            const resultado = await verificarConteudo(texto);
            
            if (!resultado.aprovado) {
                return {
                    aprovado: false,
                    campoRejeitado: nomeCampo,
                    mensagem: resultado.mensagem
                };
            }
        }
    }

    return {
        aprovado: true
    };
    */

    // MOCK: Implementação temporária
    for (const [nomeCampo, texto] of Object.entries(campos)) {
        if (texto && texto.trim()) {
            const resultado = await verificarConteudo(texto);
            
            if (!resultado.aprovado) {
                return {
                    aprovado: false,
                    campoRejeitado: nomeCampo,
                    mensagem: resultado.mensagem
                };
            }
        }
    }

    return {
        aprovado: true
    };
};
