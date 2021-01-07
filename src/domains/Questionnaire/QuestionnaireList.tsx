import React, { useState } from 'react';
import { useAlert } from 'react-alert';

export default function QuestionnaireList() {
  const alert = useAlert();
  const [loading, setLoading] = useState<boolean>(true);

  const [questionnaireList, setQuestionnaireList] = useState();

  return <div>Questionnaire List</div>;
}
