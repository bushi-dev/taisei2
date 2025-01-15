import { getPath } from '../util/util'

export default function About() {
  return (
    <div>
      アバウトページ
      <img
        src={getPath('/image/logo.png')}
        alt="Sample logo"
        style={{ width: '200px', marginTop: '20px' }}
      />
    </div>
  )
}
