export type Clasificacion = {
  sector: string;
  region: string;
  descripcion: string;
};

const SIN_CLASIFICAR: Clasificacion = {
  sector: "Sin clasificar",
  region: "Sin clasificar",
  descripcion: "",
};

/**
 * Sector, region and a short description per symbol. This is reference data
 * that barely changes (a company's industry doesn't shift week to week), so
 * it's maintained here in code rather than fetched live — one less external
 * dependency. If Agus adds a new holding, it just falls back to
 * "Sin clasificar" until this table gets a new entry for it.
 */
export const CLASIFICACIONES: Record<string, Clasificacion> = {
  AMZN: {
    sector: "Consumo discrecional (E-commerce)",
    region: "Estados Unidos",
    descripcion:
      "Amazon es la mayor plataforma de comercio electrónico del mundo, con negocios adicionales en logística, publicidad digital y dispositivos. Su división de mayor rentabilidad es Amazon Web Services (AWS), líder en infraestructura de computación en la nube. Combina escala de consumo masivo con un negocio de software empresarial de alto margen.",
  },
  ASML: {
    sector: "Tecnología (Semiconductores)",
    region: "Europa (Países Bajos)",
    descripcion:
      "ASML fabrica las máquinas de litografía que permiten producir los chips más avanzados del mundo, incluyendo la litografía ultravioleta extrema (EUV). Es proveedor prácticamente monopólico de esa tecnología, esencial para TSMC, Samsung e Intel. Su negocio depende del ciclo de inversión en capacidad de fabricación de semiconductores a nivel global.",
  },
  BABA: {
    sector: "Consumo discrecional (E-commerce)",
    region: "Asia (China)",
    descripcion:
      "Alibaba opera las principales plataformas de comercio electrónico de China (Taobao, Tmall) y tiene negocios en computación en la nube, logística y pagos digitales. Es uno de los mayores conglomerados tecnológicos de Asia. Su cotización está influenciada tanto por el consumo interno chino como por el marco regulatorio del gobierno chino sobre tecnológicas.",
  },
  CRWD: {
    sector: "Tecnología (Ciberseguridad)",
    region: "Estados Unidos",
    descripcion:
      "CrowdStrike ofrece software de ciberseguridad basado en la nube, especializado en protección de endpoints (dispositivos) contra ataques informáticos usando inteligencia artificial. Es uno de los líderes del sector de seguridad corporativa. Su modelo de suscripción genera ingresos recurrentes y crecientes a medida que las empresas priorizan la seguridad digital.",
  },
  FSLR: {
    sector: "Energía (Energía solar)",
    region: "Estados Unidos",
    descripcion:
      "First Solar fabrica paneles solares de película delgada, con producción concentrada en Estados Unidos. Se beneficia de subsidios e incentivos a la energía renovable, especialmente en su mercado local. Es uno de los pocos fabricantes solares de escala fuera de China, lo que lo posiciona distinto frente a la competencia asiática.",
  },
  GOOGL: {
    sector: "Tecnología (Internet y publicidad)",
    region: "Estados Unidos",
    descripcion:
      "Alphabet es la empresa matriz de Google, con el negocio de búsqueda y publicidad digital como principal fuente de ingresos. También incluye YouTube, Google Cloud y proyectos de inteligencia artificial de punta. Es una de las compañías tecnológicas más grandes y diversificadas del mundo.",
  },
  MELI: {
    sector: "Consumo discrecional (E-commerce)",
    region: "Latinoamérica",
    descripcion:
      "Mercado Libre es la plataforma de comercio electrónico líder en América Latina, con presencia fuerte en Argentina, Brasil y México. Incluye además Mercado Pago (pagos digitales) y Mercado Envíos (logística). Es una de las pocas empresas tecnológicas de la región con escala y rentabilidad consolidadas.",
  },
  META: {
    sector: "Tecnología (Redes sociales)",
    region: "Estados Unidos",
    descripcion:
      "Meta es la empresa matriz de Facebook, Instagram y WhatsApp, con la publicidad digital como principal fuente de ingresos. También invierte fuertemente en inteligencia artificial y en proyectos de realidad aumentada/virtual (Reality Labs). Su negocio depende en gran medida de la cantidad de usuarios activos y del gasto publicitario global.",
  },
  MSFT: {
    sector: "Tecnología (Software)",
    region: "Estados Unidos",
    descripcion:
      "Microsoft produce software empresarial (Office, Windows), servicios de computación en la nube (Azure) y videojuegos (Xbox). Es uno de los mayores proveedores de infraestructura en la nube del mundo, compitiendo con AWS y Google Cloud. Tiene además una fuerte apuesta en inteligencia artificial a través de su asociación con OpenAI.",
  },
  NU: {
    sector: "Financiero (Banca digital)",
    region: "Latinoamérica",
    descripcion:
      "Nu Holdings (Nubank) es un banco digital líder en Brasil, México y Colombia, con tarjetas de crédito, cuentas y productos de inversión sin sucursales físicas. Se destaca por su bajo costo operativo y su rápido crecimiento en usuarios. Su negocio está atado al nivel de bancarización y consumo de crédito en la región.",
  },
  NVDA: {
    sector: "Tecnología (Semiconductores)",
    region: "Estados Unidos",
    descripcion:
      "NVIDIA diseña los procesadores gráficos (GPU) que se convirtieron en el estándar para entrenar e implementar modelos de inteligencia artificial. Domina el mercado de chips para centros de datos de IA, además de su negocio histórico en gaming. Es una de las empresas con mayor exposición directa al crecimiento de la inteligencia artificial.",
  },
  PAM: {
    sector: "Energía (Integrada: petróleo, gas y electricidad)",
    region: "Latinoamérica (Argentina)",
    descripcion:
      "Pampa Energía es una empresa energética integrada argentina, con actividades en generación eléctrica, petróleo y gas (incluyendo Vaca Muerta) y distribución. Es uno de los principales jugadores del sector energético del país. Su desempeño está ligado a la política energética local y al precio internacional de los hidrocarburos.",
  },
  TSLA: {
    sector: "Consumo discrecional (Automotriz)",
    region: "Estados Unidos",
    descripcion:
      "Tesla fabrica vehículos eléctricos y desarrolla tecnología de baterías, paneles solares y sistemas de conducción autónoma. Es el fabricante de autos eléctricos más grande fuera de China. Su valuación incorpora expectativas sobre negocios adicionales como robótica e inteligencia artificial aplicada a manejo autónomo.",
  },
  TXN: {
    sector: "Tecnología (Semiconductores)",
    region: "Estados Unidos",
    descripcion:
      "Texas Instruments fabrica semiconductores analógicos y de procesamiento embebido, usados en electrónica industrial, automotriz y de consumo masivo. A diferencia de otros fabricantes de chips, tiene un negocio más estable y menos ligado a un solo ciclo (como IA o gaming). Es reconocida por su disciplina financiera y devolución de capital a accionistas.",
  },
  VIST: {
    sector: "Energía (Petróleo y gas)",
    region: "Latinoamérica (Argentina)",
    descripcion:
      "Vista Energy es una petrolera enfocada en la producción de petróleo no convencional (shale) en Vaca Muerta, Argentina. Es una de las compañías de mayor crecimiento en producción de la formación. Su cotización está fuertemente influenciada por el precio internacional del petróleo y el desarrollo de infraestructura de exportación argentina.",
  },
  UBER: {
    sector: "Tecnología (Movilidad y logística)",
    region: "Estados Unidos",
    descripcion:
      "Uber opera plataformas de transporte de pasajeros y delivery de comida (Uber Eats) a nivel global, conectando usuarios con conductores y repartidores independientes. Diversificó hacia logística de carga y publicidad dentro de su app. Su rentabilidad mejoró significativamente en los últimos años tras un fuerte foco en eficiencia operativa.",
  },
  EWZ: {
    sector: "ETF (renta variable diversificada)",
    region: "Latinoamérica (Brasil)",
    descripcion:
      "EWZ es un ETF que replica el índice de las principales empresas brasileñas que cotizan en bolsa, con fuerte peso en bancos, energía y minería (Petrobras, Vale, Itaú, entre otras). Es la forma más común de tomar exposición diversificada a la economía brasileña desde el exterior. Su valor está atado tanto al desempeño bursátil local como al tipo de cambio real/dólar.",
  },
  INDA: {
    sector: "ETF (renta variable diversificada)",
    region: "Asia (India)",
    descripcion:
      "INDA es un ETF que replica un índice amplio de acciones indias, con exposición a bancos, tecnología, energía y consumo. Da acceso diversificado a una de las economías emergentes de mayor crecimiento poblacional y de clase media. Su desempeño depende del crecimiento económico indio y de flujos de capital internacional hacia mercados emergentes.",
  },
  SPY: {
    sector: "ETF (renta variable diversificada)",
    region: "Estados Unidos / Global",
    descripcion:
      "SPY replica el índice S&P 500, las 500 empresas más grandes que cotizan en bolsa en Estados Unidos, abarcando todos los sectores de la economía. Es el ETF más operado del mundo y una referencia estándar del mercado accionario estadounidense. Ofrece diversificación amplia con una sola posición.",
  },
  GLD: {
    sector: "Materias primas (Oro)",
    region: "Global",
    descripcion:
      "GLD es un ETF respaldado físicamente por oro, diseñado para replicar el precio del metal sin necesidad de comprarlo o almacenarlo directamente. Suele usarse como cobertura frente a la inflación o a la incertidumbre económica y geopolítica. Su valor sigue de cerca el precio internacional del oro.",
  },
  QQQ: {
    sector: "ETF (renta variable, sesgo tecnológico)",
    region: "Estados Unidos / Global",
    descripcion:
      "QQQ replica el índice Nasdaq-100, compuesto por las 100 empresas no financieras más grandes que cotizan en el Nasdaq, con fuerte concentración en tecnología (Apple, Microsoft, NVIDIA, entre otras). Es una forma habitual de tomar exposición concentrada al sector tecnológico estadounidense. Tiende a ser más volátil que un índice más amplio como el S&P 500.",
  },
};

export function getClasificacion(simbolo: string): Clasificacion {
  return CLASIFICACIONES[simbolo.trim().toUpperCase()] ?? SIN_CLASIFICAR;
}
