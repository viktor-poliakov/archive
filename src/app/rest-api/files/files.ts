import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CodeBlock } from '../../code/code-block';

@Component({
  selector: 'app-rest-api-files',
  imports: [CodeBlock, RouterLink],
  templateUrl: './files.html',
  styleUrls: ['../../content/doc.scss'],
})
export class RestApiFiles {
  protected readonly formDataExample = `// FormData собирает multipart-тело: текстовые поля и файлы вперемешку.
const form = new FormData();
form.append('title', 'My photo');
form.append('tags', 'nature');

// File берём из <input type="file">
const input = document.querySelector('input[type=file]');
form.append('file', input.files[0]);

const res = await fetch('https://api.example.com/photos', {
  method: 'POST',
  body: form,
  // ВАЖНО: Content-Type здесь НЕ указываем! Браузер сам подставит
  // multipart/form-data и добавит boundary — разделитель между частями.
  // Если задать заголовок вручную, boundary потеряется и сервер
  // не сможет разобрать тело.
});`;

  protected readonly blobExample = `// Blob — неизменяемый кусок байтов с типом (MIME). Так забирают
// картинку, PDF, архив — всё, что не текст и не JSON.
const res = await fetch('https://api.example.com/report.pdf');
const blob = await res.blob();

blob.size; // размер в байтах
blob.type; // 'application/pdf'

// Blob можно создать и вручную — например, сгенерировать CSV на клиенте
const csv = 'id,name\\n1,Ada\\n2,Grace';
const csvBlob = new Blob([csv], { type: 'text/csv' });`;

  protected readonly downloadExample = `// Скачать файл = получить Blob и "подсунуть" его ссылке с атрибутом download.
async function downloadFile(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

  const blob = await res.blob();

  // Временный URL, указывающий на blob в памяти браузера
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename; // под каким именем сохранить файл
  a.click();

  // Обязательно освобождаем память: без revoke blob висит до перезагрузки
  URL.revokeObjectURL(objectUrl);
}

await downloadFile('https://api.example.com/report.pdf', 'report.pdf');`;

  protected readonly downloadProgressExample = `// Прогресс скачивания: читаем тело ответа потоком, кусок за куском.
async function downloadWithProgress(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);

  // Content-Length приходит не всегда (chunked-ответ, сжатие gzip).
  // Если его нет — процент посчитать нельзя, покажем принятые байты.
  const total = Number(res.headers.get('Content-Length')) || 0;

  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    received += value.length;
    onProgress(total ? received / total : null, received);
  }

  // Склеиваем куски обратно в единый Blob
  return new Blob(chunks);
}

const blob = await downloadWithProgress(url, (ratio, bytes) => {
  const label = ratio !== null ? \`\${Math.round(ratio * 100)}%\` : \`\${bytes} bytes\`;
  console.log(label);
});`;

  protected readonly uploadProgressExample = `// fetch НЕ умеет сообщать прогресс ОТПРАВКИ. Если он нужен —
// берём старый XMLHttpRequest: у него есть событие upload.onprogress.
function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    // Прогресс именно отправки тела на сервер
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };

    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

await uploadWithProgress('/api/upload', form, (ratio) => {
  console.log(\`\${Math.round(ratio * 100)}%\`);
});`;
}
