import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

/**
 * @author Lars Andreas Strand and Ibrahim Queeum
 * @description This component displays the member benefits of a club.
 * It includes a title, an introduction, and a list of benefits.
 * The component uses the `useTranslation` hook from `react-i18next` for internationalization.
 * The Trans component from react-i18next is used to handle translations to maintain the structure of the text.
 */

const MemberBenefit = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 p-4 rounded-xl">
      <h1 className="text-4xl font-bold mb-4">{t('member_benefit_title')}</h1>
      <h2>{t('member_benefit_intro')}</h2>
      <ul className="mt-2 list-disc pl-5 space-y-2">
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
  );
};

export default MemberBenefit;
