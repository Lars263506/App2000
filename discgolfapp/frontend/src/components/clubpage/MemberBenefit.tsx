import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

const MemberBenefit = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center w-full">
      <div className="bg-[#E7EFFB] py-4 rounded-xl w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {t('member_benefit_title')}
        </h1>

        <h2>{t('member_benefit_intro')}</h2>

        <ul className="mt-4 list-disc pl-5 space-y-2">
          <li>
            <Trans i18nKey="member_benefit_list.discounts">
              <strong>Placeholder:</strong> Description text.
            </Trans>
          </li>
          <li>
            <Trans i18nKey="member_benefit_list.exclusive_training">
              <strong>Placeholder:</strong> Description text.
            </Trans>
          </li>
          <li>
            <Trans i18nKey="member_benefit_list.networking">
              <strong>Placeholder:</strong> Description text.
            </Trans>
          </li>
          <li>
            <Trans i18nKey="member_benefit_list.priority_booking">
              <strong>Placeholder:</strong> Description text.
            </Trans>
          </li>
          <li>
            <Trans i18nKey="member_benefit_list.competitions">
              <strong>Placeholder:</strong> Description text.
            </Trans>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MemberBenefit;
