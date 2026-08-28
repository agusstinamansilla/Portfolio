# Portfolio Dashboard

Dashboard de cartera para clientes, alimentado en vivo desde tu Google Sheet
("Total cuenta" + "operaciones"). Vos editás el Sheet, el dashboard se
actualiza solo (revisa cada 60 segundos).

## Cómo funciona

- `src/lib/sheets.ts` llama a la Google Sheets API (`values.get`) para leer
  las dos hojas.
- `src/lib/parse.ts` interpreta esas filas/columnas **buscando los títulos**
  (Símbolo, Activos, Efectivo, RESULTADO..., OPERACIÓN, etc.) en vez de
  usar números de fila fijos. Esto significa que podés agregar o sacar
  posiciones, o insertar filas, y el dashboard lo sigue leyendo bien —
  siempre que no cambies el texto de los encabezados.
- La página (`src/app/page.tsx`) pide `/api/portfolio` cada 60s y muestra
  el resultado.

## 1. Conseguir la API key de Google

1. Andá a [Google Cloud Console](https://console.cloud.google.com/) y creá
   un proyecto (o usá uno existente).
2. En "APIs & Services" → "Library", buscá **Google Sheets API** y
   habilitala.
3. En "APIs & Services" → "Credentials" → "Create credentials" → **API key**.
4. (Recomendado) Restringí esa key para que solo pueda usar la Google
   Sheets API.
5. Confirmá que tu Google Sheet esté compartido como **"Cualquier persona
   con el enlace puede ver"** (ya lo está, según me dijiste) — la API key
   sola solo puede leer hojas públicas de esta forma.

## 2. Configurar variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```
SHEET_ID=1dvx4w_S3Fw-N6EY1Z-wRYzDAWw-lGyA6iFsfZ4SegQ0
GOOGLE_API_KEY=tu-api-key-de-google
```

## 3. Probar en local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000. Si todavía no tenés la API key a mano, podés
previsualizar con datos de ejemplo:

```bash
USE_FIXTURES=1 npm run dev
```

## 4. Deploy en Vercel

1. Subí este proyecto a un repo de GitHub.
2. En [vercel.com](https://vercel.com), "Add New" → "Project" → importá el
   repo.
3. En "Environment Variables" agregá `SHEET_ID` y `GOOGLE_API_KEY` (los
   mismos valores de tu `.env.local`).
4. Deploy. El link que te da Vercel (`algo.vercel.app`) es el que le pasás
   al cliente.

Cada vez que edites el Google Sheet, el dashboard se va a actualizar solo
la próxima vez que alguien lo abra o dentro del minuto (por el refresco
automático). No hace falta redeploy.

## Si el Sheet cambia de estructura

El parser depende de que ciertos textos sigan apareciendo en las hojas:

- **Total cuenta**: "Símbolo" (dos veces: acciones y ETFs), "POSICIÓN
  ACTUAL", "Activos", "Efectivo", "Total", y los títulos "RESULTADO PRIMER
  SEMESTRE" / "RESULTADO SEGUNDO TRIMESTRE" / "RESULTADO AÑO ACUMULADO".
- **operaciones**: el encabezado "OPERACIÓN" (con columnas ACCION,
  CANTIDAD, PRECIO al lado).

Si cambiás esos textos o el orden de las columnas, avisame y ajusto el
parser (`src/lib/parse.ts`).
