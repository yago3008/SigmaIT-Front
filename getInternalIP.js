import os from 'os';
import fs from 'fs/promises';
import path from 'path';

// Função para obter o IP local
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'IP não encontrado';
};

// Função para verificar e salvar a variável no .env
const updateEnvVariable = async (key, value) => {
  const envPath = path.resolve('.env');

  try {
    let envContent = '';

    // Verifica se o arquivo .env existe
    try {
      envContent = await fs.readFile(envPath, 'utf8');
    } catch {
      console.log('Arquivo .env não encontrado, criando um novo.');
    }

    // Divide o conteúdo do .env em linhas
    const lines = envContent.split('\n');
    let updated = false;

    // Verifica se a variável já existe e substitui o valor
    const newLines = lines.map((line) => {
      if (line.startsWith(`${key}=`)) {
        updated = true;
        return `${key}=${value}`;
      }
      return line;
    });

    // Se a variável não existia, adiciona uma nova linha
    if (!updated) {
      newLines.push(`${key}=${value}`);
    }

    // Salva as alterações no arquivo .env
    await fs.writeFile(envPath, newLines.join('\n'), 'utf8');
    console.log(`Variável ${key} atualizada/salva no arquivo .env`);
  } catch (error) {
    console.error('Erro ao atualizar o arquivo .env:', error);
  }
};

const localIP = getLocalIP();
if (localIP !== 'IP não encontrado') {
  updateEnvVariable('VITE_SERVER_IP', localIP + ':3000');
} else {
  console.log('Nenhum IP local encontrado.');
}
