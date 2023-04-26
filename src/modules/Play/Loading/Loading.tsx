import S from './Loading.module.scss';

export type Props = {
  progress?: number; // 0..1
};

export const Loading: React.FC<Props> = ({ progress = 0 }) => (
  <div className={S['wrapper']}>
    <div className={S['container']}>
      <span className={S['title']}>Loading</span>
      <div className={S['progress-bar']}>
        <div className={S['bar']} style={{ right: `${(1 - progress) * 100}%` }} />
      </div>
    </div>
  </div>
);
