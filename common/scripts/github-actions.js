
async function execa(command, params) {
  const { spawn } = require('child_process');
  const child = spawn(command, params);

  let data = "";
  for await (const chunk of child.stdout) {
      console.log('stdout chunk: '+chunk);
      data += chunk;
  }
  let error = "";
  for await (const chunk of child.stderr) {
      console.error('stderr chunk: '+chunk);
      error += chunk;
  }
  const exitCode = await new Promise( (resolve, reject) => {
      child.on('close', resolve);
  });

  if( exitCode) {
      throw new Error( `subprocess error exit ${exitCode}, ${error}`);
  }
  return data;
}



module.exports = async ({github, context, core}) => {
  const commits = github.event.commits
  // const list = ['catalogs','csd','curp','pdf','rfc','utils','xml','openssl','saxon']
  const list = ['catalogs','csd','utils','xml','openssl','saxon']
  for (const commit of commits) {
    const commit = commit.message;
    const [type, msg] = commit.split(':')
    const scope = type.match(/\(([^)]+)\)/g).pop().replace(/[{()}]/g, '')
    if (list.includes(scope)){
      const data = await execa('rush', ['version', '--version-policy', scope, '--bump' ])
      console.log(scope, stdout);
    }
  }
}