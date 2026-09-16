# Portfolio Dashboard

Dashboard de cartera para clientes, alimentado en vivo desde tu Google Sheet
("Total cuenta" + "operaciones"). Vos editás el Sheet, el dashboard se
actualiza solo (revisa cada 60 segundos).

## Cómo funciona

- `src/lib/sheets.ts` llama a la Google Sheets API (`values.get`) para leer
  tres hojas: **Total cuenta**, **operaciones** y **Var. Hoy**.
- El parser (`src/lib/parse.ts`) interpreta esas filas/columnas **buscando
  los títulos** ("Símbolo", "Activos", "Efectivo", "RESULTADO...",
  "OPERACIÓN", "Precio hoy"...) en vez de usar números de fila fijos. Esto
  significa que podés agregar o sacar posiciones, o insertar filas, y el
  dashboard lo sigue leyendo bien — siempre que no cambies el texto de los
  encabezados.
- Cada página pide su endpoint correspondiente (`/api/portfolio` o
  `/api/variaciones-hoy`) cada 60s y muestra el resultado.

### La hoja "Var. Hoy"

Es la que alimenta la pestaña "Variaciones Hoy" del dashboard. Tiene que
tener la misma estructura que "Total cuenta" (un bloque ACCIONES y un
bloque ETFs, cada uno con su propia fila de encabezados), con columnas:
**Símbolo**, **Empresa**, **Precio hoy**, **Precio Ayer**, **Variacion**.
Se recomienda usar `GOOGLEFINANCE` en esas columnas (por ejemplo
`=GOOGLEFINANCE(A5,"price")` y `=GOOGLEFINANCE(A5,"closeyest")`) para que
se actualice sola.

### La pestaña "Noticias"

Trae noticias de Yahoo Finance (búsqueda por ticker, hasta 3 por símbolo)
para cada acción y ETF que tengas en "Total cuenta". No necesita nada
configurado en el Sheet — se arma sola a partir de los símbolos que ya
tenés ahí. Se actualiza cada 30 minutos (las noticias no cambian tan
rápido como los precios). Si algún símbolo no tiene cobertura de noticias
en Yahoo (pasa con algunos ADRs menos conocidos), simplemente no aparece
nada de ese símbolo — no rompe el resto.

### La pestaña "Análisis Sectorial"

Dos gráficos de torta (por industria y por región) más un índice de las
empresas de la cartera con una descripción corta de cada una. No lee nada
del Sheet más allá de qué posiciones tenés y su valor actual — el sector,
la región y la descripción de cada empresa están en
`src/lib/clasificacion.ts`, mantenidos a mano en el código (es información
que casi no cambia, así que no tiene sentido pedírsela a una API cada
minuto). **Si agregás una posición nueva que no está en esa tabla, va a
aparecer como "Sin clasificar"** hasta que se agregue una entrada nueva ahí
— avisame cuando sume una acción o ETF nuevo y la agrego.

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
