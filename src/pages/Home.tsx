import { getPath } from '../util/util'

export default function Home() {
  return (
    <div>
      ホームページ
      <img
        src={getPath('/image/logo.png')}
        alt="Sample logo"
        style={{ width: '200px', marginTop: '20px' }}
      />
    </div>
  )
}
