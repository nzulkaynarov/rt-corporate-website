# 3D Модели для портала RailTech (GLTF / GLB)

В Three.js вьюпорт портала (`WireframeViewport.tsx`) встроен автоматический загрузчик **GLTFLoader**.  
Если в данную папку (`public/models/`) поместить готовые 3D-файлы в формате `.glb`, система автоматически отрендерит их с высокой детализацией, материалами и инженерной подсветкой.

---

## Имена файлов для 4 режимов:

1. **`public/models/bogie.glb`** — Двухосная тележка 18-100 или колесная пара (режим `.SUPPLY`).
2. **`public/models/container.glb`** — 40-футовый интермодальный контейнер (режим `.CONTRACT`).
3. **`public/models/network.glb`** — Нейросетевая топология / IT-серверная нода (режим `.DIGITAL`).
4. **`public/models/hypercube.glb`** — Архитектурный арт-объект / гиперкуб (режим `.PROJECTS`).

---

## Где найти готовые бесплатные 3D-модели:

### 1. GrabCAD (Самая большая база реальных инженерных CAD-моделей)
- **Сайт:** [https://grabcad.com/library](https://grabcad.com/library)
- **Поисковые запросы:**
  - `bogie 18-100` (реальная модель тележки 18-100 по ГОСТ);
  - `railway wheelset` (колесная пара РУ1Ш);
  - `coupler SA-3` (автосцепка СА-3);
  - `shipping container 40ft` (интермодальный контейнер).
- **Как скачать:** Скачиваете модель в формате STEP, IGES или OBJ. Открываете в бесплатном **Blender** (или онлайн на `threejs.org/editor`) и нажимаете **File -> Export -> glTF 2.0 (.glb)**.

### 2. Sketchfab (Готовые оптимизированные .GLB модели)
- **Сайт:** [https://sketchfab.com/feed](https://sketchfab.com/feed)
- **Фильтр:** Поставьте галочку **«Downloadable»** и выберите бесплатные (CC) лицензии.
- **Поисковые запросы:**
  - `train bogie`
  - `freight car bogie`
  - `intermodal container`
  - `neural network 3d`
  - `abstract sculpture`
- **Формат скачивания:** Выбирайте **«Autoconverted format (glTF)»** или **«.GLB»**. Скачанный файл просто переименуйте в `bogie.glb` и положите в эту папку.

### 3. CGTrader & Free3D
- [https://www.cgtrader.com/free-3d-models](https://www.cgtrader.com/free-3d-models) (фильтр: Free + Low-poly / Game-ready).
- [https://free3d.com/](https://free3d.com/)

---

## Оптимизация моделей для веба:
- Рекомендуемый размер файла: **от 500 КБ до 8 МБ**.
- Количество полигонов: до 50 000 – 100 000 треугольников для моментальной загрузки (60 FPS даже на мобильных телефонах).
