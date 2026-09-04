import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных сайта Маляр",
};

export default function PrivacyPage() {
  return (
    <div className="bg-cream-50 py-14">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="font-heading text-3xl font-bold text-forest-900">
          Политика конфиденциальности
        </h1>
        <p className="mt-2 text-sm text-moss">
          Последнее обновление: сентябрь 2026 г.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink/80">
          <section>
            <h2 className="text-lg font-bold text-ink">1. Общие положения</h2>
            <p className="mt-2">
              Настоящая Политика определяет порядок обработки и защиты персональных данных
              пользователей сайта «Маляр» (далее — Сайт), operated by ООО «СОКРАТ СТРОЙ».
              Используя Сайт, вы соглашаетесь с условиями данной Политики.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">2. Какие данные мы собираем</h2>
            <p className="mt-2">Мы можем получать следующие персональные данные:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1">
              <li>Имя и название организации</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты</li>
              <li>Содержание обращений и заявок через формы Сайта</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">3. Цели обработки данных</h2>
            <p className="mt-2">Персональные данные используются исключительно для:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1">
              <li>Обработки заявок на покупку и подбор материалов</li>
              <li>Связи с клиентом для уточнения деталей заказа</li>
              <li>Консультирования по продукции и услугам</li>
              <li>Улучшения качества обслуживания</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">4. Хранение и защита данных</h2>
            <p className="mt-2">
              Персональные данные хранятся на защищённых серверах и обрабатываются
              в соответствии с требованиями законодательства РФ. Доступ к данным имеют
              только уполномоченные сотрудники. Мы не передаём персональные данные
              третьим лицам, за исключением случаев, предусмотренных законом.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">5. Права пользователя</h2>
            <p className="mt-2">Вы вправе:</p>
            <ul className="mt-2 ml-5 list-disc space-y-1">
              <li>Запросить информацию о хранящихся персональных данных</li>
              <li>Потребовать исправления неточных данных</li>
              <li>Потребовать удаления персональных данных</li>
              <li>Отозвать согласие на обработку данных</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-ink">6. Контактная информация</h2>
            <p className="mt-2">
              По вопросам обработки персональных данных обращайтесь:
            </p>
            <ul className="mt-2 ml-5 list-disc space-y-1">
              <li>Телефон: +7 (911) 453-12-20</li>
              <li>E-mail: info@malyar39.ru</li>
              <li>Адрес: Калининград, ул. Дзержинского, 168</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
