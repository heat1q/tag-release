import * as core from "@actions/core"
import { getTagsForReference } from "./github_api"

// 1. get service tag as input
// 2. search for last -rc tag for service
// 3. collect all tags since last -rc tag non-including range
//    - if len(tags) == 0 return
// 4. create release with service name, current version
//    and all tag + commit message
// 5. create -rc tag on current ref

export const run = async (): Promise<void> => {
    try {
        await release(core.getInput("release-tag"))
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
}

const release = async (releaseTag: string) => {
    const owner = "vwdfive"
    const repo = "weconnect-backend"
    let tags = await getTagsForReference(releaseTag, owner, repo)
    tags.sort(sortTag)
}

const sortTag = (a: string, b: string) => {
    const splitA = a.split("/")
    const va: string = splitA[splitA.length - 1]
    const splitB = b.split("/")
    const vb: string = splitB[splitB.length - 1]

    const [mja, mia, pa] = decomposeSemver(va)
    const [mjb, mib, pb] = decomposeSemver(vb)

    if (mja !== mjb) return mjb - mja
    if (mia !== mib) return mib - mia
    return pb - pa
}

const decomposeSemver = (v: string): Array<number> => {
    const left = v.split("-")[0]
    return left.split(".").map(s => parseInt(s))
}
