// Importa os estilos definidos em um arquivo Calendar.css
import './Calendar.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

// Array contendo os nomes dos meses abreviados
const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

// Array contendo os nomes dos dias da semana abreviados
const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

// Declaração do componente funcional chamado Calendar
export function Calendar( {onDateChange} ) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Obtém a data atual
  const date = new Date();

  //obtém as três primeiras letras do dia da semana
  const options = { weekday: 'short', locale: 'pt-BR' };

  //obtém o dia da semana
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  // Remover o ponto final
  dayOfWeek = dayOfWeek.slice(0, -1);
  // Capitalizar a primeira letra
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  // Obtém o ano atual
  const year = date.getFullYear();
  // Obtém o mês atual (0 a 11, onde janeiro é 0 e dezembro é 11)
  const month = date.getMonth();
  // Obtém o nome abreviado do mês atual usando o array monthNames
  const nameMonth = monthNames[month];


// Função para obter os nomes dos dias da semana
function getWeeks() {
  const arrayWeeks = [];

  // Encontrar o índice do dia da semana em weekNames
  const startIndex = weekNames.indexOf(dayOfWeek);
  
  // Obter o último dia do mês
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Calcular a diferença entre o dia atual e o último dia do mês
  const daysDifference = lastDayOfMonth.getDate() - date.getDate() + 1;

  // Loop para obter os nomes dos dias da semana começando do mesmo dia de dayOfWeek
  for (let i = 0; i < daysDifference; i++) {
    const index = (startIndex + i) % 7;
    const nameWeek = weekNames[index];
    arrayWeeks.push(nameWeek);
  }

  return arrayWeeks;
}
// Função para obter os números dos dias do mês
function getNumber() {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Último dia do mês
    
    const startDay = date.getDate(); // Dia atual do mês
  
    const numbersWeek = [];
    // Loop para obter os números dos dias do mês começando com o valor do dia atual
    for (let i = 0; i < lastDayOfMonth.getDate() - startDay + 1; i++) {
      let next = new Date(firstDayOfMonth.getTime());
      next.setDate(startDay + i);
  
      // Obtém o número do dia do mês atual
      const numberWeek = next.getDate();
      numbersWeek.push(numberWeek);
    }
    return numbersWeek;
}
  // Chama as funções para obter os nomes e números dos dias da semana
  const weekDays = getWeeks();
  const numberDays = getNumber();

  // Função para lidar com a mudança de data
  const handleDateClick = (day) => {
    setSelectedDay(day);
    if (onDateChange) {
      onDateChange(day);
    }
  };
// Adicione PropTypes para validar as propriedades
Calendar.propTypes = {
  onDateChange: PropTypes.func,
};
  // Retorna a estrutura JSX do componente
return (
  <div className='container__Calendar'>
    {/* Exibe o nome abreviado do mês */}
    <h1 className="month">{nameMonth}</h1>
    {/* Exibe o ano */}
    <h2 className="year">{year}</h2>

    {/* Lista os nomes dos dias da semana */}
    <div className='sectionCalendar'>
      <div className="listNamesWeek">
        {weekDays.map((date, index) => (
          <div key={`weekDay-${index}`} className="list__name__Week">
            <p className='dayWeekCurrent'>{date}</p>
          </div>
        ))}
      </div>

      {/* Lista os números dos dias do mês */}
      <div className='listDayWeek'>
          {numberDays.map((number) => (
            <div
              key={`day-${number}`}
              className={`list__name__day ${selectedDay === number ? 'activeCalendar' : ''}`}
              onClick={() => handleDateClick(number)}
            >
              <p className='day'>{number}</p>
            </div>
          ))}
        </div>
    </div>
  </div>
);

}
