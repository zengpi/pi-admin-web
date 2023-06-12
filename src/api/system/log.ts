import type { AxiosPromise } from "axios";

import qs from "qs";

import request from "@/util/axios";

import type { Page } from "@/model";
import type { Log, Query } from "@/model/system/log";

const BASE_URL = "/log";

function getLogs(query: Query): AxiosPromise<Page<Log>> {
  return request.get(`${BASE_URL}?` + qs.stringify(query, { indices: false }));
}

function deleteLogs(ids: string): AxiosPromise<string | null> {
  return request.delete(`${BASE_URL}/${ids}`);
}

function exportLog(query: Query): AxiosPromise<ArrayBuffer> {
  return request.get(
    `${BASE_URL}/export?` + qs.stringify(query, { indices: false }),
    {
      responseType: "arraybuffer",
    }
  );
}

export { getLogs, deleteLogs, exportLog };
