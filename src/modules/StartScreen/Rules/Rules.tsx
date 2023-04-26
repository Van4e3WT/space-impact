import S from './Rules.module.scss';

type Props = {
  rules: Array<string>;
};

export const Rules: React.FC<Props> = ({ rules }) => (
  <div className={S['wrapper']}>
    <span className={S['title']}>Rules</span>
    <ul className={S['list']}>
      {rules.map((val) => (
        <li key={val} className={S['list-item']}>{val}</li>
      ))}
    </ul>
    <span className={S['motivation']}>Score as many points as possible and set records!</span>
  </div>
);
