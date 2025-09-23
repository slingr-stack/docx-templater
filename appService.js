const svc = require('@slingr/slingr-services');
const { populateWordTemplate } = require('./docx-templater.js');

svc.hooks.onSvcStart = () => {
    svc.logger.info('DOCX Templater Service has started');
}

svc.hooks.onSvcStop = (cause) => {
    svc.logger.info('DOCX Templater Service is stopping.');
}

svc.functions.parse = ({ params, id }) => {
    let {fileName, templateId, model } = params;

    populateWordTemplate(fileName, templateId, model)
        .then((content) => {
            svc.events.send('onParseComplete', {
                content: content,
                ok: true,
            }, id);
        })
        .catch(err => {
            svc.events.send('onParseComplete', {
                ok: false,
                error: err.message,
            }, id);
        });
    return { ok: true };
};

svc.start();
