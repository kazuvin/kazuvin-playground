import { Agentation } from 'agentation'
import { createRoot } from 'react-dom/client'

/* agentation-mcp server の既定ポート。--port を変えたらここも合わせる。 */
const ENDPOINT = 'http://localhost:4747'

export function mountAgentationToolbar() {
  /* マウント先は body 直下に作る。本文の中に混ぜると grid の子になってしまう。 */
  const host = document.body.appendChild(document.createElement('div'))
  createRoot(host).render(<Agentation endpoint={ENDPOINT} />)
}
