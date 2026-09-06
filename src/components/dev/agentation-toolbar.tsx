import { Agentation } from 'agentation'
import { createRoot } from 'react-dom/client'

/* agentation-mcp server の既定ポート。--port を変えたらここも合わせる。 */
const ENDPOINT = 'http://localhost:4747'

/**
 * Agentation のツールバーを body 直下にマウントする。
 *
 * 呼ぶのは base-layout の dev 専用 script だけ。island (client:only) にしないのは
 * そちらの理由を base-layout 側に書いてある。React 要素で書きたいだけの薄い層で、
 * ここに条件分岐は置かない (呼ぶかどうかは呼び出し側が決める)。
 */
export function mountAgentationToolbar() {
  /* ツールバー本体は portal で body に出るが、マウント先は自前で用意する。
     <slot /> の中に混ぜると本文のレイアウト (grid) の子になってしまう。 */
  const host = document.body.appendChild(document.createElement('div'))
  createRoot(host).render(<Agentation endpoint={ENDPOINT} />)
}
